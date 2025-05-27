import { computed, inject, signal } from '@angular/core';
import {
  Cell,
  Direction,
  Hunter,
  GameSettings,
  CELL_CONTENTS,
  Chars,
  CellContentType,
} from '../models';
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
  hunter: {} as Hunter,
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
    level: computed(() => settings().size - 4 ),
    char: computed(() => settings().selectedChar),
    gold: computed(() => hunter().gold),
    inventory: computed(() => hunter().inventory),
    currentCell: computed(() => {
      const { x, y } = hunter();
      return board()[x][y];
    }),
  })),
  withMethods((store, localStorage = inject(LocalstorageService)) => {
    const storageKey = 'hunt_the_bishomalo_hunter';
    const startTime = signal<Date | null>(null);

    const placeRandom = (board: Cell[][], excluded: Set<string>, settings: GameSettings): Cell => {
      let cell: Cell;
      const size = settings.size;
      do {
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);
        cell = board[x][y];
      } while (cell.content || excluded.has(`${cell.x},${cell.y}`));
      return cell;
    };

    const placeEvents = (board: Cell[][], hunter: Hunter, settings: GameSettings) => {
      const { difficulty } = settings;
      const ex = new Set(['0,0']);
      const chance = (base: number, max: number) =>
        Math.min(
          base + ((settings.size - 4) / (difficulty.maxLevels - 4)) * (max - base),
          max,
        );

      if (Math.random() < chance(difficulty.baseChance, difficulty.maxChance) && hunter.lives < difficulty.maxLives) {
        placeRandom(board, ex, settings).content = CELL_CONTENTS.heart;
      }

      if (Math.random() < difficulty.baseChance && !hunter.dragonballs) {
        placeRandom(board, ex, settings).content = CELL_CONTENTS.dragonball;
      }
    };

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
        console.log('fallo')
      }
    };

    const initBoard = () => {
      const settings = store.settings();
      const hunter = store.hunter();
      const board: Cell[][] = Array.from({ length: settings.size }, (_, x) =>
        Array.from({ length: settings.size }, (_, y) => ({ x, y, visited: false }))
      );

      const ex = new Set(['0,0']);
      placeRandom(board, ex, settings).content = CELL_CONTENTS.gold;

      for (let i = 0; i < (settings.wumpus || 1); i++) {
        const type = `wumpus${settings.selectedChar}` as CellContentType;
        placeRandom(board, ex, settings).content = CELL_CONTENTS[type];
      }
      for (let i = 0; i < settings.pits; i++) {
        placeRandom(board, new Set(['0,0', '0,1', '1,0']), settings).content = CELL_CONTENTS.pit;
      }

      for (let i = 0; i < (settings.wumpus || 1) - 1; i++) {
        placeRandom(board, ex, settings).content = CELL_CONTENTS.arrow;
      }

      placeEvents(board, hunter, settings);
      patchState(store, { board });
      setHunterForNextLevel();
      startTime.set(new Date());
    };

    const resetHunter = () => {
      const newHunter: Hunter = {
        ...initialHunter,
        chars: store.hunter().chars,
      };
      patchState(store, { hunter: newHunter });
      localStorage.setValue(storageKey, newHunter);
    };

    const setHunterForNextLevel = () => {
      const hunter = store.hunter();
      const settings = store.settings();
      patchState(store, {
        hunter: {
          ...hunter,
          x: 0,
          y: 0,
          direction: Direction.RIGHT,
          arrows: settings.arrows,
          alive: true,
          hasGold: false,
          hasWon: false,
          wumpusKilled: 0,
          lives: Math.min(hunter.lives, settings.difficulty.maxLives),
        },
      });
    };

    const updateHunter = (partial: Partial<Hunter>) => {
      const updated = { ...store.hunter(), ...partial };
      patchState(store, { hunter: updated });

      if (!updated.alive || updated.hasWon) {
        localStorage.setValue(storageKey, {
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
      initBoard,
      resetHunter,
      setHunterForNextLevel,
      updateBoard,
      setMessage,
      syncHunterWithStorage,
      getStartTime: () => startTime,
    };
  }),
  withHooks({
    onInit(store) {
      store.syncHunterWithStorage();
    },
  })
);
