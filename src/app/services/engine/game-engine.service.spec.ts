import { TestBed } from '@angular/core/testing';
import { GameEngineService } from './game-engine.service';
import { Direction } from '../../models';
import { GameStoreService } from '../store/game-store.service';
import { GameSoundService } from '../sound/game-sound.service';
import { LeaderboardService } from '../score/leaderboard.service';

function createMockCell(overrides = {}) {
  return {
    x: 0,
    y: 0,
    hasPit: false,
    hasWumpus: false,
    hasGold: false,
    isStart: false,
    ...overrides
  };
}

const mockStore = {
  hunter: jest.fn(),
  settings: jest.fn().mockReturnValue({
    size: 2,
    player: 'TestPlayer',
    arrows: 1,
    pits: 0
  }),
  board: jest.fn(),
  startTime: new Date(),
  getCurrentCell: jest.fn(),
  updateHunter: jest.fn(),
  markCellVisited: jest.fn(),
  setMessage: jest.fn(),
  updateBoard: jest.fn(),
  setSettings: jest.fn(),
  initBoard: jest.fn()
};

const mockSound = {
  stop: jest.fn(),
  stopWumpus: jest.fn(),
  playWumpus: jest.fn(),
  playwind: jest.fn(),
  playGold: jest.fn(),
  playSound: jest.fn()
};

const mockLeaderboard = {
  addEntry: jest.fn()
};

describe('GameEngineService (with useValue)', () => {
  let service: GameEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GameEngineService,
        { provide: GameStoreService, useValue: mockStore },
        { provide: GameSoundService, useValue: mockSound },
        { provide: LeaderboardService, useValue: mockLeaderboard }
      ]
    });

    service = TestBed.inject(GameEngineService);

    jest.clearAllMocks();

    mockStore.hunter.mockReturnValue({
      x: 0,
      y: 0,
      direction: Direction.RIGHT,
      alive: true,
      arrows: 1,
      hasGold: false
    });

    mockStore.getCurrentCell.mockReturnValue(createMockCell({ x: 0, y: 0 }));

    mockStore.board.mockReturnValue([
      [createMockCell({ x: 0, y: 0 }), createMockCell({ x: 0, y: 1 })],
      [createMockCell({ x: 1, y: 0 }), createMockCell({ x: 1, y: 1 })]
    ]);
  });

  it('initGame: calls stop, setSettings, initBoard and checkCurrentCell', () => {
    const config = { size: 2, player: 'Player', arrows: 3, pits: 2, wumpus: 1 };
    service.initGame(config);

    expect(mockSound.stop).toHaveBeenCalled();
    expect(mockStore.setSettings).toHaveBeenCalledWith(config);
    expect(mockStore.initBoard).toHaveBeenCalled();
    expect(mockStore.markCellVisited).toHaveBeenCalledWith(0, 0);
  });

  it('moveForward: should move and check current cell', () => {
    service.moveForward();

    expect(mockSound.stop).toHaveBeenCalled();
    expect(mockStore.updateHunter).toHaveBeenCalledWith({ x: 0, y: 1 });
    expect(mockStore.markCellVisited).toHaveBeenCalled();
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
      x: 0, y: 0, direction: Direction.RIGHT, arrows: 1, alive: true
    });
    const board = [
      [{ hasWumpus: true }, { hasWumpus: false }]
    ];
    mockStore.board.mockReturnValue(board);
    service.shootArrow();
    expect(mockStore.setMessage).toHaveBeenCalledWith('¡Has matado al Wumpus! ¡Grito!');
    expect(mockSound.stopWumpus).toHaveBeenCalled();
    expect(mockStore.updateBoard).toHaveBeenCalled();
  });

  it('shootArrow: reports miss if Wumpus not found', () => {
    const board = [
      [{ hasWumpus: false }, { hasWumpus: false }]
    ];
    mockStore.board.mockReturnValue(board);
    service.shootArrow();
    expect(mockStore.setMessage).toHaveBeenCalledWith('¡Flecha fallida!');
  });

  it('exit: with gold on start wins game', () => {
    mockStore.hunter.mockReturnValueOnce({ hasGold: true });
    mockStore.getCurrentCell.mockReturnValue({ isStart: true });
    const now = new Date();
    mockStore.startTime = new Date(now.getTime() - 5000);
    service.exit();
    expect(mockStore.setMessage).toHaveBeenCalledWith(expect.stringContaining('¡Escapaste en'));
    expect(mockLeaderboard.addEntry).toHaveBeenCalledWith(
      expect.objectContaining({ playerName: 'TestPlayer' })
    );
  });

  it('exit: without gold or not on start', () => {
    mockStore.hunter.mockReturnValueOnce({ hasGold: false });
    mockStore.getCurrentCell.mockReturnValue({ isStart: false });
    service.exit();
    expect(mockStore.setMessage).toHaveBeenCalledWith('¡Para salir dirígete a la entrada con la moneda!');
    expect(mockLeaderboard.addEntry).not.toHaveBeenCalled();
  });

  it('checkCurrentCell: detects pit', () => {
    mockStore.getCurrentCell.mockReturnValue(createMockCell({ hasPit: true, x: 0, y: 0 }));
    service['checkCurrentCell']();
    expect(mockStore.updateHunter).toHaveBeenCalledWith({ alive: false });
    expect(mockStore.setMessage).toHaveBeenCalledWith('¡Caíste en un pozo!');
  });

  it('checkCurrentCell: detects wumpus', () => {
    mockStore.getCurrentCell.mockReturnValue(createMockCell({ hasWumpus: true, x: 0, y: 0 }));
    service['checkCurrentCell']();
    expect(mockStore.updateHunter).toHaveBeenCalledWith({ alive: false });
    expect(mockStore.setMessage).toHaveBeenCalledWith('¡El Wumpus te devoró!');
  });

  it('checkCurrentCell: picks up gold', () => {
    mockStore.getCurrentCell.mockReturnValue(createMockCell({ hasGold: true, x: 0, y: 0 }));
    service['checkCurrentCell']();
    expect(mockStore.updateHunter).toHaveBeenCalledWith({ hasGold: true });
    expect(mockStore.setMessage).toHaveBeenCalledWith('Has recogido el oro.');
  });
});
