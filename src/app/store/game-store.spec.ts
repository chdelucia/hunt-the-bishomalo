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
  initBoard: jest.Mock<void, []>;
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

  it('should reset hunter', () => {
    store.resetHunter();
    expect(store.hunter().x).toBe(0);
    expect(store.hunter().y).toBe(0);
    expect(store.hunter().arrows).toBe(1);
    expect(store.hunter().lives).toBe(mockSettings.difficulty.maxLives);
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
});
