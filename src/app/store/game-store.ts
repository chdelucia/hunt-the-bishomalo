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
  message: string;
  settings: GameSettings;
  x: number;
  y: number;
  direction: Direction;
  arrows: number;
  alive: boolean;
  hasGold: boolean;
  hasWon: boolean;
  wumpusKilled: number;
  lives: number;
  chars: Chars[];
  gold: number;
  inventory?: string[];
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
  ...initialHunter,
  message: '',
  settings: {} as GameSettings,
};

export const GameStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({
    settings,
    board,
    x,
    y,
    wumpusKilled,
    alive,
    hasGold,
    hasWon,
    gold,
    inventory,
    // Destructure all hunter properties from the state
  }) => ({
    wumpusKilled: computed(() => wumpusKilled()),
    hunterAlive: computed(() => alive()),
    hasGold: computed(() => hasGold()),
    hasWon: computed(() => hasWon()),
    blackout: computed(() => settings().blackout),
    size: computed(() => settings().size),
    difficulty: computed(() => settings().difficulty),
    level: computed(() => settings().size - 4),
    char: computed(() => settings().selectedChar),
    gold: computed(() => gold()),
    inventory: computed(() => inventory()), // Assuming inventory is now a signal in the state
    startTime: computed(() => settings().startTime),
    currentCell: computed(() => {
      const currentX = x();
      const currentY = y();
      // Ensure board and its dimensions are valid before access
      if (board() && board()[currentX] && board()[currentX][currentY]) {
        return board()[currentX][currentY];
      }
      return undefined; // Or handle error appropriately
    }),
  })),
  withMethods((store, localStorage = inject(LocalstorageService)) => {
    const storageKey = 'hunt_the_bishomalo_hunter';

    const setSettings = (settings: GameSettings) => {
      patchState(store, { settings });
    };

    const syncHunterWithStorage = () => {
      try {
        const hunterData = localStorage.getValue<Hunter>(storageKey);
        if (hunterData && typeof hunterData === 'object') {
          // Ensure all necessary properties are present or provide defaults
          const { x, y, direction, arrows, alive, hasGold, hasWon, wumpusKilled, lives, chars, gold, inventory } = hunterData;
          patchState(store, { x, y, direction, arrows, alive, hasGold, hasWon, wumpusKilled, lives, chars, gold, inventory: inventory || [] });
        }
      } catch (e) {
        console.log('Failed to sync hunter with storage:', e);
      }
    };

    const resetHunter = () => {
      // initialHunter already has all the base properties
      const newHunterState = {
        ...initialHunter,
        chars: store.chars(), // Persist chars
        // inventory will be reset from initialHunter or be undefined if not there
      };
      patchState(store, newHunterState);
      // Save the state consistent with Hunter model for localStorage
      const hunterStorage: Hunter = {
        x: newHunterState.x,
        y: newHunterState.y,
        direction: newHunterState.direction,
        arrows: newHunterState.arrows,
        alive: newHunterState.alive,
        hasGold: newHunterState.hasGold,
        hasWon: newHunterState.hasWon,
        wumpusKilled: newHunterState.wumpusKilled,
        lives: newHunterState.lives,
        chars: newHunterState.chars,
        gold: newHunterState.gold,
        inventory: newHunterState.inventory,
      };
      localStorage.setValue(storageKey, hunterStorage);
    };

    const updateHunter = (partial: Partial<Hunter>) => {
      // Create the new state by applying partial updates to the current state from the store
      const currentState = {
        x: store.x(),
        y: store.y(),
        direction: store.direction(),
        arrows: store.arrows(),
        alive: store.alive(),
        hasGold: store.hasGold(),
        hasWon: store.hasWon(),
        wumpusKilled: store.wumpusKilled(),
        lives: store.lives(),
        chars: store.chars(),
        gold: store.gold(),
        inventory: store.inventory ? store.inventory() : [], // Handle optional inventory
      };
      const updatedState = { ...currentState, ...partial };
      patchState(store, updatedState);

      // For localStorage, ensure we save a Hunter-compatible object
      const hunterStorageData: Hunter = { ...updatedState };

      if (!updatedState.alive || updatedState.hasWon) {
        localStorage.setValue(storageKey, {
          ...hunterStorageData,
          // Reset specific fields for storage upon game over/win
          hasGold: false,
          hasWon: false,
          wumpusKilled: 0,
          // Keep other fields like x, y, lives, etc. as they were at the end of the game
        });
      } else {
        // If game is ongoing, save the current state
        localStorage.setValue(storageKey, hunterStorageData);
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
      syncHunterWithStorage,
    };
  }),
  withHooks({
    onInit(store) {
      store.syncHunterWithStorage();
    },
  }),
);
