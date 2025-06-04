import { computed, inject } from '@angular/core';
import { Direction, Hunter, GameSettings, Chars, GameState, GameItem } from '../models';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
  withHooks,
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

const initialState: GameState = {
  board: [],
  hunter: initialHunter,
  message: '',
  settings: {} as GameSettings,
  wumpusKilled: 0,
  isAlive: true,
  hasWon: false,
  lives: 8,
  unlockedChars: [Chars.DEFAULT],
};

const storageKey = 'hunt_the_bishomalo_hunter';
const storageSettingsKey = 'hunt_the_bishomalo_settings';

export const GameStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ hunter, settings, board }) => ({
    arrows: computed(() => hunter().arrows),
    dragonballs: computed(() => hunter().dragonballs),
    hasGold: computed(() => hunter().hasGold),
    gold: computed(() => hunter().gold),
    inventory: computed(() => hunter().inventory),
    blackout: computed(() => settings().blackout),
    size: computed(() => settings().size),
    difficulty: computed(() => settings().difficulty),
    level: computed(() => settings().size - 4),
    selectedChar: computed(() => settings().selectedChar),
    startTime: computed(() => settings().startTime),
    currentCell: computed(() => {
      const { x, y } = hunter();
      return board()[x][y];
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

    const syncHunterWithStorage = () => {
      const gameData = localStorage.getValue<GameLocalStorageInfo>(storageKey);
      const settings = localStorage.getValue<GameSettings>(storageSettingsKey);
      if (gameData) {
        patchState(store, { 
          lives: gameData.lives, 
          unlockedChars: gameData.unlockedChars,
          settings: settings ?? {} as GameSettings, 
          hunter: {...store.hunter(), gold: gameData.gold, inventory: gameData.inventory} 
        });
      }
    };

    const resetStore = () => {
      patchState(store, {
        ...initialConfig,
        hunter: initialHunter,
        unlockedChars: store.unlockedChars()
      });

      localStorage.clearValue(storageSettingsKey);
    };

    const updateHunter = (partial: Partial<Hunter>) => {
      const updated = { ...store.hunter(), ...partial };
      patchState(store, { hunter: updated });

      if (partial.inventory || partial.gold) {
        persistGameState();
      }
    };

    const updateGame = (partial: Partial<GameState>) => {
      patchState(store, partial);

      persistGameState();

      if (partial.settings) {
        localStorage.setValue<GameSettings>(storageSettingsKey, partial.settings);
      }
    };

    const countWumpusKilled = () => {
      patchState(store, { wumpusKilled: store.wumpusKilled() + 1 });
    };

    const setMessage = (msg: string) => {
      patchState(store, { message: msg });
    };

    return {
      updateGame,
      countWumpusKilled,
      updateHunter,
      resetStore,
      setMessage,
      syncHunterWithStorage,
    };
  }),
  withHooks({
    onInit(store) {
      store.syncHunterWithStorage();
    },
  }),
);
