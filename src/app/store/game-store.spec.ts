import { TestBed } from '@angular/core/testing';
import { GameStore } from './game-store';
import { GameSettings, Hunter, Cell, Direction } from '../models';
import { LocalstorageService } from '../services';

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
    startTime: '12/08/2025',
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
    const update: Partial<Hunter> = { x: 2, y: 3, hasWon: false, alive: false };
    store.updateHunter(update);
    expect(store.x()).toBe(2);
    expect(store.y()).toBe(3);
    expect(store.hasWon()).toBe(false);
    // The actual object saved to localStorage should be a Hunter-like object.
    // GameStore's updateHunter now takes Partial<GameState>, but it should save
    // a Hunter-compatible object if the logic inside updateHunter is correct.
    // The check for expect.objectContaining(update) might still be valid
    // if the saved object contains these fields.
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
    store.updateHunter({ x: 5, y: 5, arrows: 10, lives: 1 });

    store.resetHunter();
    expect(store.x()).toBe(0);
    expect(store.y()).toBe(0);
    expect(store.direction()).toBe(Direction.RIGHT);
    expect(store.arrows()).toBe(1);
    expect(store.alive()).toBe(true);
    expect(store.hasGold()).toBe(false);
    expect(store.hasWon()).toBe(false);
    expect(store.wumpusKilled()).toBe(0);
    expect(store.lives()).toBe(8);
    expect(store.gold()).toBe(0);

    expect(localStorageServiceMock.setValue).toHaveBeenCalledWith(
      'hunt_the_bishomalo_hunter',
      expect.objectContaining({ x: 0, y: 0, arrows: 1, lives: 8 }),
    );
  });

  it('should sync hunter with storage if data exists', () => {
    localStorageServiceMock.getValue.mockReturnValue(mockHunter);
    store.syncHunterWithStorage();
    expect(store.x()).toEqual(mockHunter.x);
    expect(store.y()).toEqual(mockHunter.y);
    expect(store.direction()).toEqual(mockHunter.direction);
    expect(store.arrows()).toEqual(mockHunter.arrows);
    expect(store.alive()).toEqual(mockHunter.alive);
    expect(store.hasGold()).toEqual(mockHunter.hasGold);
    expect(store.hasWon()).toEqual(mockHunter.hasWon);
    expect(store.wumpusKilled()).toEqual(mockHunter.wumpusKilled);
    expect(store.lives()).toEqual(mockHunter.lives);
    expect(store.chars()).toEqual(mockHunter.chars);
    expect(store.gold()).toEqual(mockHunter.gold);
    // inventory is optional in GameState, mockHunter may not have it or it might be undefined
    expect(store.inventory()).toEqual(mockHunter.inventory || []);
  });

  it('should return the current cell from the board', () => {
    const testCell = { x: 0, y: 0, visited: true } as Cell;
    store.updateBoard([[testCell]]);
    store.updateHunter({ x: 0, y: 0 });
    expect(store.currentCell()).toEqual(testCell);
  });
});
