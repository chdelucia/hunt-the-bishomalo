import { TestBed } from '@angular/core/testing';
import { GameEngineService } from './game-engine.service';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import {
  GAME_STORE_TOKEN,
  GAME_SOUND_TOKEN,
  GAME_EVENT_SERVICE_TOKEN,
  LOCALSTORAGE_SERVICE_TOKEN,
} from '@hunt-the-bishomalo/core/api';
import { BoardGeneratorService } from './board-generator.service';
import { PerceptionService } from './perception.service';
import { GameAchievementTrackerService } from './game-achievement-tracker.service';
import { GameStatsTrackerService } from './game-stats-tracker.service';
import { signal } from '@angular/core';
import { Direction, RouteTypes } from '@hunt-the-bishomalo/shared-data';
import { of } from 'rxjs';

describe('GameEngineService', () => {
  let service: GameEngineService;
  let storeMock: any;
  let soundMock: any;
  let routerMock: any;
  let gameEventMock: any;
  let translocoMock: any;
  let boardGenMock: any;
  let perceptionMock: any;
  let achievementTrackerMock: any;
  let statsTrackerMock: any;

  const createMockBoard = (size: number) => {
    return Array.from({ length: size }, (_, x) =>
      Array.from({ length: size }, (_, y) => ({ x, y, visited: false }))
    );
  };

  beforeEach(() => {
    storeMock = {
      settings: signal({
        size: 4,
        difficulty: { luck: 5, maxLevels: 10, gold: 50 },
        selectedChar: 'default',
      }),
      hunter: signal({ x: 0, y: 0, direction: Direction.RIGHT, arrows: 1, hasGold: false, gold: 0 }),
      lives: signal(3),
      dragonballs: signal(0),
      board: signal(createMockBoard(4)),
      message: signal(''),
      isAlive: signal(true),
      hasWon: signal(false),
      wumpusKilled: signal(0),
      currentCell: jest.fn(),
      updateGame: jest.fn(),
      updateHunter: jest.fn(),
      resetStore: jest.fn(),
      countWumpusKilled: jest.fn(),
      setMessage: jest.fn(),
    };

    soundMock = {
      stop: jest.fn(),
      playSound: jest.fn(),
      stopWumpus: jest.fn(),
    };

    routerMock = { navigate: jest.fn() };
    gameEventMock = {
      applyEffectsOnDeath: jest.fn(),
      applyEffectByCellContent: jest.fn(),
    };
    translocoMock = { translate: jest.fn(key => key) };
    boardGenMock = {
      createBoard: jest.fn(() => createMockBoard(4)),
      placeGold: jest.fn(),
      placeWumpus: jest.fn(),
      placePits: jest.fn(),
      placeArrows: jest.fn(),
      placeEvents: jest.fn(),
      calculatePits: jest.fn(() => 2),
      calculateWumpus: jest.fn(() => 1),
    };
    perceptionMock = { getPerceptionMessage: jest.fn(() => of('perception message')) };
    achievementTrackerMock = {
      handleWallHitAchieve: jest.fn(),
      handleWumpusKillAchieve: jest.fn(),
      handleMissedArrowAchieve: jest.fn(),
      calcVictoryAchieve: jest.fn(),
    };
    statsTrackerMock = {
      handleGameOver: jest.fn(),
      clearStats: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        GameEngineService,
        { provide: GAME_STORE_TOKEN, useValue: storeMock },
        { provide: GAME_SOUND_TOKEN, useValue: soundMock },
        { provide: Router, useValue: routerMock },
        { provide: GAME_EVENT_SERVICE_TOKEN, useValue: gameEventMock },
        { provide: TranslocoService, useValue: translocoMock },
        { provide: BoardGeneratorService, useValue: boardGenMock },
        { provide: PerceptionService, useValue: perceptionMock },
        { provide: GameAchievementTrackerService, useValue: achievementTrackerMock },
        { provide: GameStatsTrackerService, useValue: statsTrackerMock },
        { provide: LOCALSTORAGE_SERVICE_TOKEN, useValue: {} },
      ],
    });

    service = TestBed.inject(GameEngineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should navigate to settings on newGame', () => {
    service.newGame();
    expect(routerMock.navigate).toHaveBeenCalledWith([RouteTypes.SETTINGS]);
    expect(statsTrackerMock.clearStats).toHaveBeenCalled();
  });

  it('should initialize game', () => {
    storeMock.currentCell.mockReturnValue({ x: 0, y: 0 });
    service.initGame();
    expect(soundMock.stop).toHaveBeenCalled();
    expect(boardGenMock.createBoard).toHaveBeenCalled();
  });

  it('should move forward', () => {
    storeMock.currentCell.mockReturnValue({ x: 0, y: 1 });
    service.moveForward();
    expect(storeMock.updateHunter).toHaveBeenCalledWith({ x: 0, y: 1 });
  });

  it('should shoot arrow and hit', () => {
    const board = createMockBoard(4);
    board[0][1].content = { type: 'wumpus' } as any;
    storeMock.board.set(board);
    storeMock.hunter.set({ x: 0, y: 0, direction: Direction.RIGHT, arrows: 1 });
    service.shootArrow();
    expect(storeMock.countWumpusKilled).toHaveBeenCalled();
    expect(achievementTrackerMock.handleWumpusKillAchieve).toHaveBeenCalled();
  });

  it('should handle wall collision', () => {
    storeMock.hunter.set({ x: 0, y: 0, direction: Direction.UP });
    service.moveForward();
    expect(storeMock.setMessage).toHaveBeenCalledWith('gameMessages.wallCollision');
  });

  it('should handle victory', () => {
    storeMock.hunter.set({ hasGold: true, gold: 100 });
    storeMock.currentCell.mockReturnValue({ x: 0, y: 0 });
    service.exit();
    expect(storeMock.updateGame).toHaveBeenCalledWith(expect.objectContaining({ hasWon: true }));
  });

  it('should handle secret path', () => {
    storeMock.settings.set({ size: 8, difficulty: { luck: 5 } });
    storeMock.hunter.set({ x: 7, y: 7, direction: Direction.RIGHT });
    service.moveForward();
    expect(routerMock.navigate).toHaveBeenCalledWith([RouteTypes.JEDI, 'secret'], expect.anything());
  });

  it('should handle turns', () => {
     storeMock.hunter.set({ direction: Direction.RIGHT });
     service.turnLeft();
     expect(storeMock.updateHunter).toHaveBeenCalledWith({ direction: Direction.UP });

     storeMock.hunter.set({ direction: Direction.RIGHT });
     service.turnRight();
     expect(storeMock.updateHunter).toHaveBeenCalledWith({ direction: Direction.DOWN });
  });

  it('should handle advance level', () => {
    storeMock.currentCell.mockReturnValue({ x: 0, y: 0 });
    service.nextLevel();
    expect(storeMock.updateGame).toHaveBeenCalled();
  });

  it('should track steps and handle game over', () => {
    storeMock.hunter.set({ x: 1, y: 0 });
    TestBed.flushEffects();
    storeMock.isAlive.set(false);
    TestBed.flushEffects();
    expect(statsTrackerMock.handleGameOver).toHaveBeenCalled();
  });
});
