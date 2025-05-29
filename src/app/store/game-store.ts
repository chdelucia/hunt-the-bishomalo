import { computed, inject } from '@angular/core';
import { Cell, Direction, Hunter, GameSettings, Chars } from '../models';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
  withHooks,
} from '@ngrx/signals';
import { LocalstorageService } from '../services';

interface GameState {
  board: Cell[][];
  hunter: Hunter;
  message: string;
  settings: GameSettings;
}

const initialHunter: Hunter = {
  x: 0,
  y: 0,
  direction: Direction.RIGHT,
  arrows: 1,
  alive: true,
  hasGold: false,
  hasWon: false,
  wumpusKilled: 0,
  lives: 8,
  chars: [Chars.DEFAULT],
  gold: 0,
};

const initialState: GameState = {
  board: [],
  hunter: initialHunter,
  message: '',
  settings: {} as GameSettings,
};

export const GameStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ hunter, settings, board }) => ({
    wumpusKilled: computed(() => hunter().wumpusKilled),
    hunterAlive: computed(() => hunter().alive),
    hasGold: computed(() => hunter().hasGold),
    hasWon: computed(() => hunter().hasWon),
    blackout: computed(() => settings().blackout),
    size: computed(() => settings().size),
    difficulty: computed(() => settings().difficulty),
    level: computed(() => settings().size - 4),
    char: computed(() => settings().selectedChar),
    gold: computed(() => hunter().gold),
    inventory: computed(() => hunter().inventory),
    startTime: computed(() => settings().startTime),
    currentCell: computed(() => {
      const { x, y } = hunter();
      return board()[x][y];
    }),
  })),
  withMethods((store, localStorage = inject(LocalstorageService)) => {
    const HUNTER_STORAGE_KEY = 'hunt_the_bishomalo_hunter';
    const SETTINGS_STORAGE_KEY = 'hunt_the_bishomalo_settings';

    const setSettings = (settings: GameSettings) => {
      patchState(store, { settings });
      localStorage.setValue(SETTINGS_STORAGE_KEY, settings);
    };

    const syncStateWithStorage = () => {
      try {
        const hunter = localStorage.getValue<Hunter>(HUNTER_STORAGE_KEY);
        if (hunter && typeof hunter === 'object') {
          patchState(store, { hunter });
        }
      } catch (e) {
        console.error('Failed to load hunter from localStorage', e);
      }
      try {
        const settings = localStorage.getValue<GameSettings>(SETTINGS_STORAGE_KEY);
        if (settings && typeof settings === 'object') {
          patchState(store, { settings });
        }
      } catch (e) {
        console.error('Failed to load settings from localStorage', e);
      }
    };

    const resetHunter = () => {
      const newHunter: Hunter = {
        ...initialHunter,
        chars: store.hunter().chars,
      };
      patchState(store, { hunter: newHunter });
      localStorage.setValue(HUNTER_STORAGE_KEY, newHunter);
    };

    const updateHunter = (partial: Partial<Hunter>) => {
      const updated = { ...store.hunter(), ...partial };
      patchState(store, { hunter: updated });

      if (!updated.alive || updated.hasWon) {
        localStorage.setValue(HUNTER_STORAGE_KEY, {
          ...updated,
          hasGold: false,
          hasWon: false,
          wumpusKilled: 0,
        });
      }
    };

    const updateBoard = (newBoard: Cell[][]) => {
      patchState(store, { board: newBoard });
    };

    const setMessage = (msg: string) => {
      patchState(store, { message: msg });
    };

    return {
      setSettings,
      updateHunter,
      resetHunter,
      updateBoard,
      setMessage,
      syncStateWithStorage,
    };
  }),
  withHooks({
    onInit(store) {
      store.syncStateWithStorage();
    },
  }),
);
