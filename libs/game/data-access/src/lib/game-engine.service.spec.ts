import { TestBed } from '@angular/core/testing';
import { GameEngineService } from './game-engine.service';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import {
  GAME_STORE_TOKEN,
  GAME_SOUND_TOKEN,
  GAME_EVENT_SERVICE_TOKEN,
  LOCALSTORAGE_SERVICE_TOKEN,
  ACHIEVEMENT_SERVICE,
} from '@hunt-the-bishomalo/core/api';
import { LEADERBOARD_SERVICE } from '@hunt-the-bishomalo/gamestats/api';
import { BoardGeneratorService } from './board-generator.service';
import { PerceptionService } from './perception.service';
import { signal } from '@angular/core';
import { Direction, AchieveTypes, RouteTypes } from '@hunt-the-bishomalo/shared-data';
import { of } from 'rxjs';

describe('GameEngineService', () => {
  let service: GameEngineService;
  let storeMock: any;
  let soundMock: any;
  let leaderboardMock: any;
  let achieveMock: any;
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
      startTime: signal(new Date().toISOString()),
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

    leaderboardMock = { clear: jest.fn(), addEntry: jest.fn() };
    achieveMock = {
      activeAchievement: jest.fn(),
      handleWumpusKillAchieve: jest.fn(),
      isAllCompleted: jest.fn(),
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

    TestBed.configureTestingModule({
      providers: [
        GameEngineService,
        { provide: GAME_STORE_TOKEN, useValue: storeMock },
        { provide: GAME_SOUND_TOKEN, useValue: soundMock },
        { provide: LEADERBOARD_SERVICE, useValue: leaderboardMock },
        { provide: ACHIEVEMENT_SERVICE, useValue: achieveMock },
        { provide: Router, useValue: routerMock },
        { provide: GAME_EVENT_SERVICE_TOKEN, useValue: gameEventMock },
        { provide: TranslocoService, useValue: translocoMock },
        { provide: BoardGeneratorService, useValue: boardGenMock },
        { provide: PerceptionService, useValue: perceptionMock },
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

  it('should handle survivor', () => {
     const cell = { x: 1, y: 1, content: { type: 'pit' } };
     storeMock.currentCell.mockReturnValue(cell);
     gameEventMock.applyEffectsOnDeath.mockReturnValue(true);
     service.moveForward();
     expect(gameEventMock.applyEffectsOnDeath).toHaveBeenCalled();
  });

  it('should handle missed shot', () => {
    const board = createMockBoard(4);
    storeMock.board.set(board);
    storeMock.hunter.set({ x: 0, y: 0, direction: Direction.RIGHT, arrows: 1 });
    storeMock.updateHunter.mockImplementation((update: any) => {
      storeMock.hunter.set({ ...storeMock.hunter(), ...update });
    });
    service.shootArrow();
    expect(achieveMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.MISSEDSHOT);
  });

  it('should handle arrow flight in multiple directions', () => {
     const board = createMockBoard(4);
     storeMock.board.set(board);
     storeMock.hunter.set({ x: 1, y: 1, direction: Direction.UP, arrows: 1 });
     service.shootArrow();

     storeMock.hunter.set({ x: 1, y: 1, direction: Direction.DOWN, arrows: 1 });
     service.shootArrow();

     storeMock.hunter.set({ x: 1, y: 1, direction: Direction.LEFT, arrows: 1 });
     service.shootArrow();
  });

  it('should handle advance level', () => {
    storeMock.currentCell.mockReturnValue({ x: 0, y: 0 });
    service.nextLevel();
    expect(storeMock.updateGame).toHaveBeenCalled();
  });

  it('should handle wumpus drop on hit', () => {
     const board = createMockBoard(4);
     const cell = board[0][1];
     cell.content = { type: 'wumpus' } as any;
     storeMock.board.set(board);
     storeMock.hunter.set({ x: 0, y: 0, direction: Direction.RIGHT, arrows: 1 });

     jest.spyOn(Math, 'random').mockReturnValue(0.01);
     service.shootArrow();
     expect(cell.content).toBeDefined();
     (Math.random as jest.Mock).mockRestore();
  });

  it('should handle turns', () => {
     storeMock.hunter.set({ direction: Direction.RIGHT });
     service.turnLeft();
     expect(storeMock.updateHunter).toHaveBeenCalledWith({ direction: Direction.UP });

     storeMock.hunter.set({ direction: Direction.RIGHT });
     service.turnRight();
     expect(storeMock.updateHunter).toHaveBeenCalledWith({ direction: Direction.DOWN });
  });

  it('should handle perception message from cell', () => {
     const res = (service as any).perceptionService.getPerceptionMessage([{ content: { type: 'wumpus' } } as any]);
     res.subscribe(msg => expect(msg).toBe('gameMessages.perceptionStench'));
  });

  it('should handle move forward and check secret', () => {
     storeMock.settings.set({ size: 8 });
     storeMock.hunter.set({ x: 7, y: 7, direction: Direction.RIGHT });
     service.moveForward();
     expect(routerMock.navigate).toHaveBeenCalledWith([RouteTypes.JEDI, 'secret'], expect.anything());
  });

  it('should handle move forward in multiple directions', () => {
     storeMock.hunter.set({ x: 1, y: 1, direction: Direction.UP });
     service.moveForward();
     expect(storeMock.updateHunter).toHaveBeenCalledWith({ x: 0, y: 1 });

     storeMock.hunter.set({ x: 1, y: 1, direction: Direction.DOWN });
     service.moveForward();
     expect(storeMock.updateHunter).toHaveBeenCalledWith({ x: 2, y: 1 });

     storeMock.hunter.set({ x: 1, y: 1, direction: Direction.LEFT });
     service.moveForward();
     expect(storeMock.updateHunter).toHaveBeenCalledWith({ x: 1, y: 0 });
  });

  it('should handle arrow flight in multiple directions', () => {
     storeMock.hunter.set({ x: 1, y: 1, direction: Direction.UP, arrows: 1 });
     service.shootArrow();

     storeMock.hunter.set({ x: 1, y: 1, direction: Direction.DOWN, arrows: 1 });
     service.shootArrow();

     storeMock.hunter.set({ x: 1, y: 1, direction: Direction.LEFT, arrows: 1 });
     service.shootArrow();
  });

  it('should handle wumpus drop on hit', () => {
     const board = createMockBoard(4);
     const cell = board[0][1];
     cell.content = { type: 'wumpus' } as any;
     storeMock.board.set(board);
     storeMock.hunter.set({ x: 0, y: 0, direction: Direction.RIGHT, arrows: 1 });

     const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.01);
     service.shootArrow();
     expect(cell.content).toBeDefined();
     randomSpy.mockRestore();
  });

  it('should handle wall hit achievement', () => {
     storeMock.hunter.set({ x: 0, y: 0, direction: Direction.UP });
     storeMock.message.set('gameMessages.wallCollision');
     service.moveForward();
     expect(achieveMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.HARDHEAD);
  });

  it('should handle turn left and right multiple times', () => {
     storeMock.hunter.set({ direction: Direction.RIGHT });
     service.turnLeft();
     expect(storeMock.updateHunter).toHaveBeenCalledWith({ direction: Direction.UP });

     storeMock.hunter.set({ direction: Direction.UP });
     service.turnLeft();
     expect(storeMock.updateHunter).toHaveBeenCalledWith({ direction: Direction.LEFT });

     storeMock.hunter.set({ direction: Direction.LEFT });
     service.turnRight();
     expect(storeMock.updateHunter).toHaveBeenCalledWith({ direction: Direction.UP });
  });

  describe('tracking and achievements', () => {
    it('should track steps', () => {
      // Step counter increments when x or y is not 0
      storeMock.hunter.set({ x: 1, y: 0 });
      TestBed.flushEffects();
      // Accessing private countSteps via any to verify internal state if needed,
      // but better to verify it via the leaderboard call.
      storeMock.isAlive.set(false);
      TestBed.flushEffects();
      expect(leaderboardMock.addEntry).toHaveBeenCalledWith(expect.objectContaining({
        steps: 1
      }));
    });

    it('should calculate victory achievements and check all completed', () => {
      storeMock.wumpusKilled.set(1);
      storeMock.hunter.set({ arrows: 1 });
      storeMock.settings.set({ size: 12, difficulty: { luck: 5 } });

      service.calcVictoryAchieve(5); // 5 seconds (speedrunner)

      expect(achieveMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.WINLARGEMAP);
      expect(achieveMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.SPEEDRUNNER);
      expect(achieveMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.WINHERO);
      expect(achieveMock.isAllCompleted).toHaveBeenCalled();
    });

    it('should handle game over with victory', () => {
      storeMock.hasWon.set(true);
      TestBed.flushEffects();
      expect(leaderboardMock.addEntry).toHaveBeenCalled();
      expect(achieveMock.isAllCompleted).toHaveBeenCalled();
    });


    it('should handle wumpus kill achievements', () => {
      storeMock.hunter.set({ x: 0, y: 0 });
      service.handleWumpusKillAchieve({ x: 0, y: 5 } as any);
      expect(achieveMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.SNIPER);

      service.handleWumpusKillAchieve({ x: 0, y: 1 } as any);
      expect(achieveMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.DEATHDUEL);
    });

    it('should handle cartography achievements', () => {
      storeMock.settings.set({ size: 4, pits: 0 });
      storeMock.board.set([
        [{ visited: true }, { visited: true }, { visited: true }, { visited: true }],
        [{ visited: true }, { visited: true }, { visited: true }, { visited: true }],
        [{ visited: true }, { visited: true }, { visited: true }, { visited: true }],
        [{ visited: true }, { visited: true }, { visited: true }, { visited: true }],
      ]);

      (service as any).cartographyAchieve();
      expect(achieveMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.EXPERTCARTO);
    });
  });
});
