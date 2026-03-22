import { TestBed } from '@angular/core/testing';
import { GameStore } from './game-store';
import { Chars, GameSettings, Hunter, Cell, Direction } from '@hunt-the-bishomalo/shared-data';
import { LOCALSTORAGE_SERVICE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { LocalstorageService } from '../services';

const localStorageServiceMock = {
  getValue: jest.fn(),
  setValue: jest.fn(),
  clearValue: jest.fn(),
};

describe('GameStore (SignalStore)', () => {
  let store: any;

  const mockHunter: Hunter = {
    x: 0,
    y: 0,
    direction: Direction.RIGHT,
    arrows: 1,
    hasGold: false,
    gold: 0,
    inventory: [],
  };

  const mockSettings: GameSettings = {
    player: 'TestPlayer',
    size: 5,
    pits: 2,
    arrows: 3,
    wumpus: 1,
    selectedChar: Chars.DEFAULT,
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
    soundEnabled: true,
  };

  beforeEach(() => {
    localStorageServiceMock.getValue.mockReturnValue(null);
    localStorageServiceMock.setValue.mockClear();
    localStorageServiceMock.clearValue.mockClear();

    TestBed.configureTestingModule({
      providers: [
        GameStore,
        { provide: LOCALSTORAGE_SERVICE_TOKEN, useValue: localStorageServiceMock },
        { provide: LocalstorageService, useValue: localStorageServiceMock },
      ],
    });

    store = TestBed.inject(GameStore) as any;
  });

  it('should create the store', () => {
    expect(store).toBeTruthy();
  });

  it('should update the hunter and persist if hasWon is true', () => {
    const update: Partial<Hunter> = { x: 2, y: 3 };
    store.updateHunter(update);
    expect(store.hunter().x).toBe(2);
    expect(store.hunter().y).toBe(3);
    expect(store.hasWon()).toBe(false);
    expect(localStorageServiceMock.setValue).not.toHaveBeenCalled();
  });

  it('should persist when updating hunter inventory or gold', () => {
    store.updateHunter({ gold: 100 });
    expect(localStorageServiceMock.setValue).toHaveBeenCalledWith('hunt_the_bishomalo_hunter', expect.any(Object));
    localStorageServiceMock.setValue.mockClear();

    store.updateHunter({ inventory: [{ id: 'test' }] });
    expect(localStorageServiceMock.setValue).toHaveBeenCalledWith('hunt_the_bishomalo_hunter', expect.any(Object));
  });

  it('should update game status correctly', () => {
    store.updateGame({
      settings: mockSettings,
      hunter: mockHunter,
      message: 'test message',
      wumpusKilled: 1,
      board: [[{ x: 0, y: 0, visited: true } as Cell]],
      isAlive: false,
      hasWon: true,
      lives: 5,
    });
    expect(store.message()).toBe('test message');
    expect(store.wumpusKilled()).toBe(1);
    expect(store.isAlive()).toBe(false);
    expect(store.hasWon()).toBe(true);
    expect(store.lives()).toBe(5);
  });

  it('should count wumpus killed', () => {
    const initial = store.wumpusKilled();
    store.countWumpusKilled();
    expect(store.wumpusKilled()).toBe(initial + 1);
  });

  it('should update unlocked chars', () => {
    store.updateGame({ unlockedChars: [Chars.DEFAULT, Chars.JEDI] });
    expect(store.unlockedChars()).toContain(Chars.JEDI);
  });

  it('should call $_resetHunter via resetStore', () => {
    store.updateHunter({ gold: 100, arrows: 5 });
    store.resetStore();
    expect(store.gold()).toBe(0);
    expect(store.arrows()).toBe(1);
  });

  it('should call $_resetConfig via resetStore', () => {
    store.updateGame({ settings: mockSettings });
    localStorageServiceMock.clearValue.mockClear();
    store.resetStore();
    expect(store.settings()).toEqual({});
    expect(localStorageServiceMock.clearValue).toHaveBeenCalledWith('hunt_the_bishomalo_settings');
  });

  it('should call $_updateSettings via updateGame', () => {
    store.updateGame({ settings: mockSettings });
    expect(localStorageServiceMock.setValue).toHaveBeenCalledWith('hunt_the_bishomalo_settings', mockSettings);
  });

  it('should calculate level correctly', () => {
    store.updateGame({ settings: { ...mockSettings, size: 5 } });
    expect(store.level()).toBe(1);
    store.updateGame({ settings: { ...mockSettings, size: 10 } });
    expect(store.level()).toBe(6);
    store.updateGame({ settings: {} as GameSettings });
    expect(store.level()).toBe(0);
  });

  it('should set settings and reflect in signal', () => {
    store.updateGame({ settings: mockSettings });
    expect(store.settings()).toEqual(mockSettings);
  });

  it('should toggle soundEnabled correctly', () => {
    store.updateGame({ settings: { ...mockSettings, soundEnabled: false } });
    expect(store.soundEnabled()).toBe(false);

    store.toggleSound();
    expect(store.soundEnabled()).toBe(true);
    expect(localStorageServiceMock.setValue).toHaveBeenCalled();
  });

  it('should test remaining computed properties', () => {
    // dragonballs computed
    store.updateHunter({ dragonballs: 7 });
    expect(store.dragonballs()).toBe(7);

    store.updateGame({ settings: { ...mockSettings, blackout: true } });
    expect(store.blackout()).toBe(true);
    expect(store.size()).toBe(mockSettings.size);
    expect(store.difficulty()).toEqual(mockSettings.difficulty);
    expect(store.selectedChar()).toBe(mockSettings.selectedChar);
    expect(store.startTime()).toBe(mockSettings.startTime);

    // Testing hunter computed properties
    store.updateHunter({ arrows: 5, hasGold: true, gold: 10, inventory: [{ id: '1' }] });
    expect(store.arrows()).toBe(5);
    expect(store.hasGold()).toBe(true);
    expect(store.gold()).toBe(10);
    expect(store.inventory()).toEqual([{ id: '1' }]);
  });

  it('should default soundEnabled to true if not present in settings', () => {
    const settingsWithoutSound = { ...mockSettings };
    delete (settingsWithoutSound as any).soundEnabled;
    store.updateGame({ settings: settingsWithoutSound });
    expect(store.soundEnabled()).toBe(true);
  });

  it('should update board correctly', () => {
    const newBoard: Cell[][] = [[{ x: 0, y: 0, visited: false } as Cell]];
    store.updateGame({ board: newBoard });
    expect(store.board()).toEqual(newBoard);
  });

  it('should set message', () => {
    const message = 'You found gold!';
    store.setMessage(message);
    expect(store.message()).toBe(message);
  });

  it('should sync hunter with storage if data exists', () => {
    localStorageServiceMock.getValue.mockImplementation((key) => {
      if (key === 'hunt_the_bishomalo_hunter') return {
        lives: 5,
        unlockedChars: [Chars.DEFAULT],
        inventory: [],
        gold: 100
      };
      if (key === 'hunt_the_bishomalo_settings') return mockSettings;
      return null;
    });
    store.syncHunterWithStorage();
    expect(store.lives()).toBe(5);
    expect(store.gold()).toBe(100);
    expect(store.settings()).toEqual(mockSettings);
  });

  it('should return the current cell from the board', () => {
    const testCell = { x: 0, y: 0, visited: true } as Cell;
    store.updateGame({ board: [[testCell]] });
    store.updateHunter({ x: 0, y: 0 });
    expect(store.currentCell()).toEqual(testCell);
  });

  it('should return null currentCell if out of bounds', () => {
    store.updateGame({ board: [[{ x: 0, y: 0 } as Cell]] });
    store.updateHunter({ x: 1, y: 1 });
    expect(store.currentCell()).toBeNull();
  });
});
