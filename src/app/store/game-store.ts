import { computed, inject } from '@angular/core';
import { Direction, Hunter, GameSettings, Chars, GameState, GameItem, Cell } from '../models';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
  withHooks,
  signalStoreFeature,
  type,
} from '@ngrx/signals';
import { LocalstorageService } from '../services';

interface GameLocalStorageInfo {
  lives: number;
  unlockedChars: Chars[];
  inventory: GameItem[];
  gold: number;
}

const initialHunter: Hunter = {
  x: 0,
  y: 0,
  direction: Direction.RIGHT,
  arrows: 1,
  hasGold: false,
  inventory: [],
  gold: 0,
};

const initialConfig: Partial<GameState> = {
  wumpusKilled: 0,
  isAlive: true,
  hasWon: false,
  lives: 8,
};

const storageKey = 'hunt_the_bishomalo_hunter';
const storageSettingsKey = 'hunt_the_bishomalo_settings';

// Default settings to avoid type assertions like {} as GameSettings
const defaultSettings: GameSettings = {
  size: 4,
  pits: 1,
  arrows: 1,
  player: '',
  wumpus: 1,
  selectedChar: Chars.DEFAULT,
  difficulty: {
    maxLevels: 10,
    maxChance: 0.35,
    baseChance: 0.12,
    gold: 60,
    maxLives: 8,
    luck: 8,
    bossTries: 12,
  },
  startTime: new Date().toISOString(),
};

const initialState: GameState = {
  board: [],
  hunter: initialHunter,
  message: '',
  settings: defaultSettings,
  wumpusKilled: 0,
  isAlive: true,
  hasWon: false,
  lives: 8,
  unlockedChars: [Chars.DEFAULT],
};

export function withHunterFeature() {
  return signalStoreFeature(
    {
      state: type<{
        hunter: Hunter;
        unlockedChars: Chars[];
        lives: number;
        settings: GameSettings;
        board: Cell[][];
        message: string;
        wumpusKilled: number;
        isAlive: boolean;
        hasWon: boolean;
      }>(),
    },
    withComputed(({ hunter }) => ({
      arrows: computed(() => hunter().arrows),
      dragonballs: computed(() => hunter().dragonballs),
      hasGold: computed(() => hunter().hasGold),
      gold: computed(() => hunter().gold),
      inventory: computed(() => hunter().inventory),
    })),
    withMethods((store, localStorage = inject(LocalstorageService)) => ({
      updateHunter(partial: Partial<Hunter>) {
        const updated = { ...store.hunter(), ...partial };
        patchState(store, { hunter: updated });

        if (partial.inventory || partial.gold !== undefined) {
          localStorage.setValue<GameLocalStorageInfo>(storageKey, {
            inventory: updated.inventory,
            gold: updated.gold,
            lives: store.lives(),
            unlockedChars: store.unlockedChars(),
          });
        }
      },
    })),
  );
}

export function withConfigFeature() {
  return signalStoreFeature(
    {
      state: type<{
        settings: GameSettings;
        hunter: Hunter;
        unlockedChars: Chars[];
        lives: number;
        board: Cell[][];
        message: string;
        wumpusKilled: number;
        isAlive: boolean;
        hasWon: boolean;
      }>(),
    },
    withComputed(({ settings }) => ({
      blackout: computed(() => settings().blackout),
      size: computed(() => settings().size),
      difficulty: computed(() => settings().difficulty),
      level: computed(() => settings().size - 4),
      selectedChar: computed(() => settings().selectedChar),
      startTime: computed(() => settings().startTime),
    })),
  );
}

export function withGameStatusFeature() {
  return signalStoreFeature(
    {
      state: type<{
        board: Cell[][];
        hunter: Hunter;
        message: string;
        settings: GameSettings;
        wumpusKilled: number;
        isAlive: boolean;
        hasWon: boolean;
        lives: number;
        unlockedChars: Chars[];
      }>(),
    },
    withComputed(({ board, hunter }) => ({
      currentCell: computed(() => {
        const { x, y } = hunter();
        const currentBoard = board();
        if (currentBoard.length > 0 && currentBoard[x] && currentBoard[x][y]) {
          return currentBoard[x][y];
        }
        return { x, y, visited: false } as Cell;
      }),
    })),
    withMethods((store, localStorage = inject(LocalstorageService)) => {
      const persistGameState = () => {
        const currentHunter = store.hunter();
        localStorage.setValue<GameLocalStorageInfo>(storageKey, {
          inventory: currentHunter.inventory,
          gold: currentHunter.gold,
          lives: store.lives(),
          unlockedChars: store.unlockedChars(),
        });
      };

      return {
        updateGame(partial: Partial<GameState>) {
          patchState(store, partial);
          persistGameState();

          if (partial.settings) {
            localStorage.setValue<GameSettings>(storageSettingsKey, partial.settings);
          }
        },
        countWumpusKilled() {
          patchState(store, { wumpusKilled: store.wumpusKilled() + 1 });
        },
        setMessage(message: string) {
          patchState(store, { message });
        },
        resetStore() {
          patchState(store, {
            ...initialConfig,
            hunter: initialHunter,
            unlockedChars: store.unlockedChars(),
          });
          localStorage.clearValue(storageSettingsKey);
        },
        syncHunterWithStorage() {
          const gameData = localStorage.getValue<GameLocalStorageInfo>(storageKey);
          const settings = localStorage.getValue<GameSettings>(storageSettingsKey);
          if (gameData) {
            patchState(store, {
              lives: gameData.lives,
              unlockedChars: gameData.unlockedChars,
              settings: settings ?? store.settings(),
              hunter: { ...store.hunter(), gold: gameData.gold, inventory: gameData.inventory },
            });
          }
        },
      };
    }),
  );
}

export const GameStore = signalStore(
  { providedIn: 'root', protectedState: false },
  withState(initialState),
  withHunterFeature(),
  withConfigFeature(),
  withGameStatusFeature(),
  withHooks({
    onInit(store) {
      store.syncHunterWithStorage();
    },
  }),
);
