import { TestBed } from '@angular/core/testing';
import { GameEngineService } from './game-engine.service';
import { CELL_CONTENTS, Chars, Direction } from '../../models';
import { GameSoundService } from '../sound/game-sound.service';
import { LeaderboardService } from '../score/leaderboard.service';
import { GameStore } from 'src/app/store';
import { getTranslocoTestingModule } from 'src/app/utils';

function createMockCell(overrides = {}) {
  return {
    x: 0,
    y: 0,
    ...overrides,
  };
}

const mockStore = {
  hunter: jest.fn(),
  settings: jest.fn().mockReturnValue({
    size: 2,
    player: 'TestPlayer',
    arrows: 1,
    pits: 0,
    difficulty: {
      maxLevels: 10,
      maxChance: 0.35,
      baseChance: 0.12,
      gold: 60,
      maxLives: 8,
      luck: 8,
      bossTries: 12,
    },
  }),
  board: jest.fn(),
  startTime: new Date(),
  updateHunter: jest.fn(),
  setMessage: jest.fn(),
  dragonballs: jest.fn(),
  setSettings: jest.fn(),
  resetStore: jest.fn(),
  currentCell: jest.fn(),
  countWumpusKilled: jest.fn(),
  setHunterForNextLevel: jest.fn(),
  resetWumpus: jest.fn(),
  updateGame: jest.fn(),
  inventory: () => [],
  gold: jest.fn(),
  lives: () => 7,
  isAlive: jest.fn().mockReturnValue(true),
  hasWon: jest.fn(),
};

const mockSound = {
  stop: jest.fn(),
  stopWumpus: jest.fn(),
  playWumpus: jest.fn(),
  playwind: jest.fn(),
  playGold: jest.fn(),
  playSound: jest.fn(),
};

const mockLeaderboard = {
  addEntry: jest.fn(),
  clear: jest.fn(),
};

describe('GameEngineService (with useValue)', () => {
  let service: GameEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule()],
      providers: [
        GameEngineService,
        { provide: GameStore, useValue: mockStore },
        { provide: GameSoundService, useValue: mockSound },
        { provide: LeaderboardService, useValue: mockLeaderboard },
      ],
    });

    service = TestBed.inject(GameEngineService);

    jest.clearAllMocks();

    mockStore.hunter.mockReturnValue({
      x: 0,
      y: 0,
      direction: Direction.RIGHT,
      alive: true,
      arrows: 1,
      hasGold: false,
      lives: 7,
      wumpusKilled: 0,
    });

    mockStore.currentCell.mockReturnValue(createMockCell({ x: 0, y: 0 }));

    mockStore.board.mockReturnValue([
      [createMockCell({ x: 0, y: 0 }), createMockCell({ x: 0, y: 1 })],
      [createMockCell({ x: 1, y: 0 }), createMockCell({ x: 1, y: 1 })],
    ]);
  });

  it('initGame: calls stop, setSettings, initializeGameBoard and checkCurrentCell', () => {
    const config = {
      size: 2,
      player: 'Player',
      arrows: 3,
      pits: 2,
      wumpus: 1,
      selectedChar: Chars.LARA,
      difficulty: {
        maxLevels: 10,
        maxChance: 0.35,
        baseChance: 0.12,
        gold: 60,
        maxLives: 8,
        luck: 8,
        bossTries: 12,
      },
      startTime: '12/98/09',
    };
    const initGameBoardSpy = jest.spyOn(service, 'initializeGameBoard');

    service.initGame();

    expect(mockSound.stop).toHaveBeenCalled();
    expect(mockStore.updateGame).toHaveBeenCalled();
    expect(initGameBoardSpy).toHaveBeenCalled();
  });

  it('moveForward: should move and check current cell', () => {
    service.moveForward();

    expect(mockSound.stop).toHaveBeenCalled();
    expect(mockStore.updateHunter).toHaveBeenCalledWith({ x: 0, y: 1 });
  });

  it('turnLeft: rotates direction correctly', () => {
    mockStore.hunter.mockReturnValueOnce({ direction: Direction.UP });
    service.turnLeft();
    expect(mockStore.updateHunter).toHaveBeenCalledWith({ direction: Direction.LEFT });
  });

  it('turnRight: rotates direction correctly', () => {
    mockStore.hunter.mockReturnValueOnce({ direction: Direction.UP, alive: true });
    service.turnRight();
    expect(mockStore.updateHunter).toHaveBeenCalledWith({ direction: Direction.RIGHT });
  });

  it('shootArrow: with no arrows does nothing', () => {
    mockStore.hunter.mockReturnValueOnce({ arrows: 0, alive: true });
    service.shootArrow();
    expect(mockStore.setMessage).toHaveBeenCalledWith('gameMessages.noArrows');
  });

  it('shootArrow: kills Wumpus if found', () => {
    mockStore.hunter.mockReturnValueOnce({
      x: 0,
      y: 0,
      direction: Direction.RIGHT,
      arrows: 1,
      alive: true,
    });
    const board = [[{ content: CELL_CONTENTS.wumpus }, { content: undefined }]];
    mockStore.board.mockReturnValue(board);
    service.shootArrow();
    expect(mockStore.setMessage).toHaveBeenCalledWith('gameMessages.wumpusKilled');
    expect(mockSound.stopWumpus).toHaveBeenCalled();
  });

  it('shootArrow: reports miss if Wumpus not found', () => {
    const board = [[{ content: undefined }, { content: undefined }]];
    mockStore.board.mockReturnValue(board);
    service.shootArrow();
    expect(mockStore.setMessage).toHaveBeenCalledWith('gameMessages.arrowMissed');
  });

  it('exit: with gold on start wins game', () => {
    mockStore.hunter.mockReturnValueOnce({ hasGold: true });
    mockStore.currentCell.mockReturnValue({ x: 0, y: 0 });
    service.exit();
    expect(mockStore.setMessage).toHaveBeenCalledWith(
      expect.stringContaining('gameMessages.victory'),
    );
  });

  it('checkCurrentCell: detects pit', () => {
    mockStore.currentCell.mockReturnValue(
      createMockCell({ content: CELL_CONTENTS.pit, x: 0, y: 0 }),
    );
    service['checkCurrentCell'](0, 0);
    expect(mockStore.updateGame).toHaveBeenCalledWith(expect.objectContaining({ lives: 6 }));
    expect(mockStore.setMessage).toHaveBeenCalledWith('¡Caíste en un pozo!');
  });

  it('checkCurrentCell: detects wumpus', () => {
    mockStore.currentCell.mockReturnValue(
      createMockCell({ content: CELL_CONTENTS.wumpus, x: 0, y: 0 }),
    );
    service['checkCurrentCell'](0, 0);
    expect(mockStore.updateGame).toHaveBeenCalledWith(expect.objectContaining({ lives: 6 }));
    expect(mockStore.setMessage).toHaveBeenCalledWith('¡El Wumpus te devoró!');
  });

  it('checkCurrentCell: picks up gold', () => {
    mockStore.currentCell.mockReturnValue(
      createMockCell({ content: CELL_CONTENTS.gold, x: 0, y: 0 }),
    );
    service['checkCurrentCell'](0, 0);
    expect(mockStore.setMessage).toHaveBeenCalledWith('Has recogido el oro, puedes escapar.');
  });

  it('shold call newGame', () => {
    service.newGame();
    expect(mockSound.stop).toHaveBeenCalled();
    expect(mockStore.resetStore).toHaveBeenCalled();
    expect(mockLeaderboard.clear).toHaveBeenCalled();
  });

  it('shold call restartLevel', () => {
    const spyInitBoard = jest.spyOn(service, 'initializeGameBoard');
    const spyCurrentCell = jest.spyOn(service as any, 'checkCurrentCell');

    service.initGame();
    expect(mockSound.stop).toHaveBeenCalled();
    expect(spyInitBoard).toHaveBeenCalled();
    expect(spyCurrentCell).toHaveBeenCalled();
  });

  describe('nextLevel', () => {
    it('should increment size and recalculate pits and wumpus', () => {
      const setSettingsSpy = jest.spyOn(mockStore, 'updateGame');
      const initGameBoardSpy = jest.spyOn(service, 'initializeGameBoard');
      service.nextLevel();

      expect(setSettingsSpy).toHaveBeenCalled();
      expect(initGameBoardSpy).toHaveBeenCalled();
    });
  });

  describe('initializeGameBoard', () => {
    let placeRandomSpy: jest.SpyInstance;
    let placeEventsSpy: jest.SpyInstance;

    beforeEach(() => {
      placeRandomSpy = jest.spyOn(service as any, 'placeRandom').mockImplementation(() => ({
        content: undefined,
      }));
      placeEventsSpy = jest.spyOn(service as any, 'placeEvents');

      mockStore.settings.mockReturnValue({
        size: 3,
        player: 'TestPlayer',
        arrows: 2,
        pits: 1,
        wumpus: 1,
        selectedChar: Chars.LARA,
        difficulty: {
          maxLevels: 10,
          maxChance: 0.35,
          baseChance: 0.12,
          gold: 60,
          maxLives: 8,
          luck: 8,
          bossTries: 12,
        },
      });
      mockStore.hunter.mockReturnValue({
        x: 0,
        y: 0,
        direction: Direction.RIGHT,
        arrows: 0,
        alive: false,
        hasGold: false,
        hasWon: false,
        lives: 3,
        chars: [Chars.LARA],
        gold: 0,
      });
    });

    it('should initialize board with correct dimensions and update store', () => {
      service.initializeGameBoard();
      expect(mockStore.updateGame).toHaveBeenCalledWith({
        board: expect.arrayContaining([
          expect.arrayContaining([expect.objectContaining({ x: 0, y: 0, visited: false })]),
          expect.arrayContaining([expect.objectContaining({ x: 0, y: 0, visited: false })]),
          expect.arrayContaining([expect.objectContaining({ x: 0, y: 0, visited: false })]),
        ]),
      });
    });

    it('should set hunter state for new level via store.updateHunter', () => {
      service.initializeGameBoard();
      expect(mockStore.updateHunter).toHaveBeenCalledWith({
        x: 0,
        y: 0,
        direction: Direction.RIGHT,
        arrows: 1,
        hasGold: false,
      });
    });

    it('should place GOLD on the board', () => {
      service.initializeGameBoard();
      expect(placeRandomSpy).toHaveBeenCalledWith(expect.any(Array), expect.any(Set));
      const goldCall = placeRandomSpy.mock.calls.find((call) => {
        const cell = call[0][0][0];
        return true;
      });
      expect(goldCall).toBeDefined();
    });

    it('should place WUMPUS on the board', () => {
      const settings = mockStore.settings();
      settings.wumpus = 2;
      mockStore.settings.mockReturnValue(settings);
      service.initializeGameBoard();

      expect(placeRandomSpy).toHaveBeenCalled();
    });

    it('should place PITS on the board', () => {
      const settings = mockStore.settings();
      settings.pits = 3;
      mockStore.settings.mockReturnValue(settings);
      service.initializeGameBoard();
      expect(placeRandomSpy).toHaveBeenCalled();
    });

    it('should place ARROWS on the board (wumpus - 1)', () => {
      const settings = mockStore.settings();
      settings.wumpus = 3;
      mockStore.settings.mockReturnValue(settings);
      service.initializeGameBoard();
      expect(placeRandomSpy).toHaveBeenCalled();
    });

    it('should place 0 ARROWS if wumpus is 1', () => {
      const settings = mockStore.settings();
      settings.wumpus = 1;
      mockStore.settings.mockReturnValue(settings);
      service.initializeGameBoard();
      expect(placeRandomSpy).toHaveBeenCalled();
    });

    it('should call placeEvents', () => {
      service.initializeGameBoard();
      expect(placeEventsSpy).toHaveBeenCalledWith(expect.any(Array));
    });
  });
});
