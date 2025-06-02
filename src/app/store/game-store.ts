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
  isAlive: boolean;
  hasWon: boolean;
  lives: number;
}

const initialHunter: Hunter = {
  x: 0,
  y: 0,
  direction: Direction.RIGHT,
  arrows: 1,
  hasGold: false,
  chars: [Chars.DEFAULT],
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
};

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
    char: computed(() => settings().selectedChar),
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
        //TODO cambiar lo que se guarda en el store, no sirve pa na guarda X y Y y otras xuminas
        const hunter = localStorage.getValue<any>(storageKey);
        if (hunter && typeof hunter === 'object') {
          patchState(store, { hunter, lives: hunter.lives });
        }
      } catch {
        console.log('fallo');
      }
    };

    //TODO este es para reiniciar el game refactorizar
    const resetHunter = () => {
      const newHunter: Hunter = {
        ...initialHunter,
        chars: store.hunter().chars,
      };
      patchState(store, {
        hunter: newHunter,
        ...initialConfig,
      });
      localStorage.setValue(storageKey, newHunter);
    };

    const updateHunter = (partial: Partial<Hunter>) => {
      const updated = { ...store.hunter(), ...partial };
      patchState(store, { hunter: updated });
      if (partial.inventory) {
        localStorage.setValue(storageKey, {
          ...store.hunter(),
        });
      }
    };

    const updateGame = (partial: Partial<GameState>) => {
      patchState(store, partial);
      if (!partial.isAlive || partial.hasWon) {
        localStorage.setValue(storageKey, {
          ...store.hunter(),
          lives: partial.lives || store.lives(),
        });
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
      setSettings,
      updateHunter,
      resetHunter,
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
