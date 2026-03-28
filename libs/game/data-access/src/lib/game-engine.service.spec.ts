import { TestBed } from '@angular/core/testing';
import { GameEngineService } from './game-engine.service';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import {
  GAME_STORE_TOKEN,
  GAME_SOUND_TOKEN,
  GAME_EVENT_SERVICE_TOKEN,
} from '@hunt-the-bishomalo/core/api';
import {
  GAME_ACHIEVEMENT_TRACKER_TOKEN,
  GAME_STATS_TRACKER_TOKEN,
} from '@hunt-the-bishomalo/game/api';
import { BoardGeneratorService } from './board-generator.service';
import { PerceptionService } from './perception.service';
import { signal } from '@angular/core';
import { Direction, RouteTypes } from '@hunt-the-bishomalo/shared-data';
import { of } from 'rxjs';

describe('GameEngineService', () => {
  let service: GameEngineService;
  let storeMock: any;
  let soundMock: any;
  let achievementTrackerMock: any;
  let statsTrackerMock: any;
  let routerMock: any;
  let gameEventMock: any;
  let translocoMock: any;
  let boardGenMock: any;
  let perceptionMock: any;

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

    achievementTrackerMock = {
      activeAchievement: jest.fn(),
      calcVictoryAchieve: jest.fn(),
      handleWumpusKillAchieve: jest.fn(),
    };

    statsTrackerMock = {
      trackSteps: jest.fn(),
      handleGameOver: jest.fn(),
      resetSteps: jest.fn(),
    };

    routerMock = { navigate: jest.fn() };
    gameEventMock = {
      applyEffectsOnDeath: jest.fn(),
      applyEffectByCellContent: jest.fn(),
    };
    translocoMock = { translate: jest.fn((key) => key) };
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

    TestBed.configureTestingModule({
      providers: [
        GameEngineService,
        { provide: GAME_STORE_TOKEN, useValue: storeMock },
        { provide: GAME_SOUND_TOKEN, useValue: soundMock },
        { provide: GAME_ACHIEVEMENT_TRACKER_TOKEN, useValue: achievementTrackerMock },
        { provide: GAME_STATS_TRACKER_TOKEN, useValue: statsTrackerMock },
        { provide: Router, useValue: routerMock },
        { provide: GAME_EVENT_SERVICE_TOKEN, useValue: gameEventMock },
        { provide: TranslocoService, useValue: translocoMock },
        { provide: BoardGeneratorService, useValue: boardGenMock },
        { provide: PerceptionService, useValue: perceptionMock },
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
  });

  it('should not shoot if no arrows', () => {
    storeMock.hunter.set({ x: 0, y: 0, direction: Direction.RIGHT, arrows: 0 });
    service.shootArrow();
    expect(storeMock.setMessage).toHaveBeenCalledWith('gameMessages.noArrows');
  });

  it('should not move if not alive', () => {
    storeMock.isAlive.set(false);
    service.moveForward();
    expect(storeMock.updateHunter).not.toHaveBeenCalled();
  });

  it('should handle wall collision', () => {
    storeMock.hunter.set({ x: 0, y: 0, direction: Direction.UP, arrows: 1 });
    service.moveForward();
    expect(storeMock.setMessage).toHaveBeenCalledWith('gameMessages.wallCollision');
    expect(soundMock.playSound).toHaveBeenCalledWith('wall', false);
  });

  it('should turn left', () => {
    storeMock.hunter.set({ x: 0, y: 0, direction: Direction.RIGHT, arrows: 1 });
    service.turnLeft();
    expect(storeMock.updateHunter).toHaveBeenCalledWith({ direction: Direction.UP });
  });

  it('should turn right', () => {
    storeMock.hunter.set({ x: 0, y: 0, direction: Direction.RIGHT, arrows: 1 });
    service.turnRight();
    expect(storeMock.updateHunter).toHaveBeenCalledWith({ direction: Direction.DOWN });
  });

  it('should handle victory when reaching 0,0 with gold', () => {
    storeMock.currentCell.mockReturnValue({ x: 0, y: 0 });
    storeMock.hunter.set({ x: 0, y: 0, direction: Direction.RIGHT, arrows: 1, hasGold: true, gold: 0 });
    service.exit();
    expect(storeMock.setMessage).toHaveBeenCalledWith('gameMessages.victory');
    expect(storeMock.updateGame).toHaveBeenCalledWith(expect.objectContaining({ hasWon: true }));
  });
});
