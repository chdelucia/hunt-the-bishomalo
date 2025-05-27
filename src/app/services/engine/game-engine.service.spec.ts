import { TestBed } from '@angular/core/testing';
import { GameEngineService } from './game-engine.service';
import { CELL_CONTENTS, Chars, Direction } from '../../models';
import { GameSoundService } from '../sound/game-sound.service';
import { LeaderboardService } from '../score/leaderboard.service';
import { GameStore } from 'src/app/store';

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
  updateBoard: jest.fn(),
  setSettings: jest.fn(),
  initBoard: jest.fn(),
  resetHunter: jest.fn(),
  resetSettings: jest.fn(),
  currentCell: jest.fn(),
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

  it('initGame: calls stop, setSettings, initBoard and checkCurrentCell', () => {
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
    };

    service.initGame(config);

    expect(mockSound.stop).toHaveBeenCalled();
    expect(mockStore.setSettings).toHaveBeenCalledWith(config);
    expect(mockStore.initBoard).toHaveBeenCalled();
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
    expect(mockStore.setMessage).toHaveBeenCalledWith('¡No tienes flechas!');
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
    expect(mockStore.setMessage).toHaveBeenCalledWith('¡Has matado al Wumpus! ¡Grito!');
    expect(mockSound.stopWumpus).toHaveBeenCalled();
  });

  it('shootArrow: reports miss if Wumpus not found', () => {
    const board = [[{ content: undefined }, { content: undefined }]];
    mockStore.board.mockReturnValue(board);
    service.shootArrow();
    expect(mockStore.setMessage).toHaveBeenCalledWith('¡Flecha fallida!');
  });

  it('exit: with gold on start wins game', () => {
    mockStore.hunter.mockReturnValueOnce({ hasGold: true });
    mockStore.currentCell.mockReturnValue({ x: 0, y: 0 });
    service.exit();
    expect(mockStore.setMessage).toHaveBeenCalledWith(expect.stringContaining('¡Victoria'));
  });

  it('exit: without gold or not on start', () => {
    mockStore.hunter.mockReturnValueOnce({ hasGold: false });
    mockStore.currentCell.mockReturnValue({ x: 0, y: 1 });
    service.exit();
    expect(mockStore.setMessage).toHaveBeenCalledWith(
      '¡Para salir dirígete a la entrada con la moneda!',
    );
    expect(mockLeaderboard.addEntry).not.toHaveBeenCalled();
  });

  it('checkCurrentCell: detects pit', () => {
    mockStore.currentCell.mockReturnValue(
      createMockCell({ content: CELL_CONTENTS.pit, x: 0, y: 0 }),
    );
    service['checkCurrentCell'](0, 0);
    expect(mockStore.updateHunter).toHaveBeenCalledWith(
      expect.objectContaining({ alive: false, lives: 6 }),
    );
    expect(mockStore.setMessage).toHaveBeenCalledWith('¡Caíste en un pozo!');
  });

  it('checkCurrentCell: detects wumpus', () => {
    mockStore.currentCell.mockReturnValue(
      createMockCell({ content: CELL_CONTENTS.wumpus, x: 0, y: 0 }),
    );
    service['checkCurrentCell'](0, 0);
    expect(mockStore.updateHunter).toHaveBeenCalledWith(
      expect.objectContaining({ alive: false, lives: 6 }),
    );
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
    expect(mockStore.resetHunter).toHaveBeenCalled();
    expect(mockLeaderboard.clear).toHaveBeenCalled();
  });

  describe('nextLevel', () => {
    it('should increment size and recalculate pits and wumpus', () => {
      const spyInit = jest.spyOn(mockStore, 'setSettings');
      service.nextLevel();

      expect(spyInit).toHaveBeenCalledWith({
        size: 3,
        pits: 1,
        wumpus: 1,
        arrows: 1,
        blackout: expect.any(Boolean),
        player: 'TestPlayer',
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
    });
    it('should increase board size and recalculate pits', () => {
      const spyInit = jest.spyOn(mockStore, 'initBoard');
      const spySettings = jest.spyOn(mockStore, 'setSettings');
      service.nextLevel();

      expect(spyInit).toHaveBeenCalled();
      expect(spySettings).toHaveBeenCalled();
    });
  });
});
