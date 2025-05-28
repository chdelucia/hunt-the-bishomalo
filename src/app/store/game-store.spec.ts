import { TestBed } from '@angular/core/testing';
import { GameStore } from './game-store';
import { GameSettings, Hunter, Cell, Direction } from '../models';
import { WritableSignal } from '@angular/core';
import { LocalstorageService } from '../services';

type MockGameStoreType = {
  hunter: WritableSignal<Hunter>;
  settings: WritableSignal<GameSettings>;
  board: WritableSignal<Cell[][]>;
  message: WritableSignal<string>;
  wumpusKilled: WritableSignal<number>;
  hunterAlive: WritableSignal<boolean>;
  hasGold: WritableSignal<boolean>;
  hasWon: WritableSignal<boolean>;
  blackout: WritableSignal<boolean>;
  startTime: WritableSignal<Date>;

  setSettings: jest.Mock<void, [GameSettings]>;
  resetSettings: jest.Mock<void, [string]>;
  updateHunter: jest.Mock<void, [Partial<Hunter>]>;
  updateBoard: jest.Mock<void, [Cell[][]]>;
  setMessage: jest.Mock<void, [string]>;
  getCurrentCell: jest.Mock<Cell, []>;
  resetHunter: jest.Mock<void, []>;
  syncHunterWithStorage: jest.Mock<void, []>;
  getStartTime: jest.Mock<Date | null, []>;
  // initBoard is no longer part of GameStore's public API or internal methods tested here
  // initBoard: jest.Mock<void, []>; 
};

describe('GameStore (SignalStore)', () => {
  let store: any;
  let localStorageServiceMock: jest.Mocked<LocalstorageService>;

  const mockHunter: Hunter = {
    x: 0,
    y: 0,
    direction: Direction.UP,
    arrows: 3,
    alive: true,
    hasGold: false,
    hasWon: false,
    wumpusKilled: 0,
    lives: 8,
    chars: [],
    gold: 0,
  };

  const mockSettings: GameSettings = {
    player: 'TestPlayer',
    size: 5,
    pits: 2,
    arrows: 3,
    wumpus: 1,
    selectedChar: 'default' as any,
    difficulty: {
      maxLevels: 10,
      maxChance: 0.3,
      baseChance: 0.1,
      gold: 50,
      maxLives: 8,
      luck: 5,
      bossTries: 3,
    },
  };

  beforeEach(() => {
    localStorageServiceMock = {
      getValue: jest.fn(),
      setValue: jest.fn(),
    } as unknown as jest.Mocked<LocalstorageService>;

    TestBed.configureTestingModule({
      providers: [GameStore, { provide: LocalstorageService, useValue: localStorageServiceMock }],
    });

    store = TestBed.inject(GameStore);
  });

  it('should create the store', () => {
    expect(store).toBeTruthy();
  });

  it('should update the hunter and persist if hasWon is true', () => {
    const update: Partial<Hunter> = { x: 2, y: 3, hasWon: false };
    store.updateHunter(update);
    expect(store.hunter().x).toBe(2);
    expect(store.hunter().y).toBe(3);
    expect(store.hunter().hasWon).toBe(false);
    expect(localStorageServiceMock.setValue).toHaveBeenCalledWith(
      'hunt_the_bishomalo_hunter',
      expect.objectContaining(update),
    );
  });

  it('should set settings and reflect in signal', () => {
    store.setSettings(mockSettings);
    expect(store.settings()).toEqual(mockSettings);
  });

  it('should update board correctly', () => {
    const newBoard: Cell[][] = [[{ x: 0, y: 0, visited: false } as Cell]];
    store.updateBoard(newBoard);
    expect(store.board()).toEqual(newBoard);
  });

  it('should set message', () => {
    const message = 'You found gold!';
    store.setMessage(message);
    expect(store.message()).toBe(message);
  });

  it('should reset hunter to initial values', () => {
    // Modify current hunter state to be different from initialHunter
    store.updateHunter({ x: 5, y: 5, arrows: 10, lives: 1 });
    
    store.resetHunter();
    const resetState = store.hunter();
    // Compare against the actual initialHunter constant values from game-store.ts (or a mock of it)
    // For this test, we'll use the known initial values.
    expect(resetState.x).toBe(0);
    expect(resetState.y).toBe(0);
    expect(resetState.direction).toBe(Direction.RIGHT); // Assuming initialHunter.direction is RIGHT
    expect(resetState.arrows).toBe(1);
    expect(resetState.alive).toBe(true);
    expect(resetState.hasGold).toBe(false);
    expect(resetState.hasWon).toBe(false);
    expect(resetState.wumpusKilled).toBe(0);
    expect(resetState.lives).toBe(8); // From initialHunter constant
    // Chars and gold are also part of initialHunter, ensure they are reset if needed by the test.
    // expect(resetState.chars).toEqual([Chars.DEFAULT]); // If Chars.DEFAULT is accessible
    expect(resetState.gold).toBe(0);

    expect(localStorageServiceMock.setValue).toHaveBeenCalledWith(
      'hunt_the_bishomalo_hunter',
      expect.objectContaining({ x: 0, y: 0, arrows: 1, lives: 8 })
    );
  });

  it('should sync hunter with storage if data exists', () => {
    localStorageServiceMock.getValue.mockReturnValue(mockHunter);
    store.syncHunterWithStorage();
    expect(store.hunter()).toEqual(mockHunter);
  });

  it('should return the current cell from the board', () => {
    const testCell = { x: 0, y: 0, visited: true } as Cell;
    store.updateBoard([[testCell]]);
    store.updateHunter({ x: 0, y: 0 });
    expect(store.currentCell()).toEqual(testCell);
  });

  // Removed test: 'should initialize the board and hunter correctly on initBoard'
  // This logic is now in GameEngineService and tested in game-engine.service.spec.ts

  // Removed test: 'should correctly set hunter for next level'
  // This logic is now in GameEngineService (private method, tested via initializeGameBoard)
  // and its effect on the store is tested via GameEngineService's initializeGameBoard tests.
});
