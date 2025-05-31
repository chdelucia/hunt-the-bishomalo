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
  wumpusKilled: number;
}

const initialHunter: Hunter = {
  x: 0,
  y: 0,
  direction: Direction.RIGHT,
  arrows: 1,
  alive: true,
  hasGold: false,
  hasWon: false,
  lives: 8,
  chars: [Chars.DEFAULT],
  inventory: [],
  gold: 0,
};

const initialState: GameState = {
  board: [],
  hunter: initialHunter,
  message: '',
  settings: {} as GameSettings,
  wumpusKilled: 0,
};

export const GameStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ hunter, settings, board }) => ({
    lives: computed(() => hunter().lives),
    arrows: computed(() => hunter().arrows),
    dragonballs: computed(() => hunter().dragonballs),
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
    const storageKey = 'hunt_the_bishomalo_hunter';

    const setSettings = (settings: GameSettings) => {
      patchState(store, { settings });
    };

    const syncHunterWithStorage = () => {
      try {
        const hunter = localStorage.getValue<Hunter>(storageKey);
        if (hunter && typeof hunter === 'object') {
          patchState(store, { hunter });
        }
      } catch {
        console.log('fallo');
      }
    };

    const resetHunter = () => {
      const newHunter: Hunter = {
        ...initialHunter,
        chars: store.hunter().chars,
      };
      patchState(store, { hunter: newHunter, wumpusKilled: 0 });
      localStorage.setValue(storageKey, newHunter);
    };

    const updateHunter = (partial: Partial<Hunter>) => {
      const updated = { ...store.hunter(), ...partial };
      patchState(store, { hunter: updated });

      if (!updated.alive || updated.hasWon) {
        localStorage.setValue(storageKey, {
          ...updated,
          hasGold: false,
          hasWon: false,
        });
      }
    };

    const countWumpusKilled = () => {
      patchState(store, { wumpusKilled: store.wumpusKilled() + 1 });
    };

    const resetWumpus = () => {
      patchState(store, { wumpusKilled: 0 });
    };

    const updateBoard = (newBoard: Cell[][]) => {
      patchState(store, { board: newBoard });
    };

    const setMessage = (msg: string) => {
      patchState(store, { message: msg });
    };

    return {
      resetWumpus,
      countWumpusKilled,
      setSettings,
      updateHunter,
      resetHunter,
      updateBoard,
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
