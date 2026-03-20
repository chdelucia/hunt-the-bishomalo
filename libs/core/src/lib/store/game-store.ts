import { computed, inject } from '@angular/core';
import { signalStore, patchState, withHooks, withMethods, withComputed } from '@ngrx/signals';
import { LOCALSTORAGE_SERVICE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { GameSettings, Chars, GameState, GameItem, Hunter } from '@hunt-the-bishomalo/data';
import { withHunterFeature } from './features/hunter.feature';
import { withConfigFeature, storageSettingsKey } from './features/config.feature';
import { withGameStatusFeature } from './features/game-status.feature';

interface GameLocalStorageInfo {
  lives: number;
  unlockedChars: Chars[];
  inventory: GameItem[];
  gold: number;
}

const storageKey = 'hunt_the_bishomalo_hunter';

export const GameStore = signalStore(
  { providedIn: 'root' },
  withHunterFeature(),
  withConfigFeature(),
  withGameStatusFeature(),
  withComputed(({ hunter, board }) => ({
    currentCell: computed(() => {
      const { x, y } = hunter();
      const currentBoard = board();
      return currentBoard?.[x]?.[y] ?? null;
    }),
  })),
  withMethods((store, localStorage = inject(LOCALSTORAGE_SERVICE_TOKEN)) => {
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
      syncHunterWithStorage() {
        const gameData = localStorage.getValue<GameLocalStorageInfo>(storageKey);
        const settings = localStorage.getValue<GameSettings>(storageSettingsKey);
        if (gameData) {
          patchState(store, {
            lives: gameData.lives,
            unlockedChars: gameData.unlockedChars,
            settings: settings ?? ({} as GameSettings),
            hunter: { ...store.hunter(), gold: gameData.gold, inventory: gameData.inventory },
          });
        }
      },

      resetStore() {
        store.$_resetHunter();
        store.$_resetGameStatus();
        store.$_resetConfig();
        const gameData = localStorage.getValue<GameLocalStorageInfo>(storageKey);
        if (gameData) {
          store.$_setUnlockedChars(gameData.unlockedChars);
        }
      },

      updateHunter(partial: Partial<Hunter>) {
        store.$_updateHunter(partial);
        if (partial.inventory || partial.gold) {
          persistGameState();
        }
      },

      updateGame(partial: Partial<GameState>) {
        const { settings, hunter, unlockedChars, ...statusPartial } = partial;

        if (settings) {
          store.$_updateSettings(settings);
        }

        if (hunter) {
          store.$_updateHunter(hunter);
        }

        if (unlockedChars) {
          store.$_setUnlockedChars(unlockedChars);
        }

        if (Object.keys(statusPartial).length > 0) {
          store.$_updateGameStatus(statusPartial);
        }

        persistGameState();
      },

      countWumpusKilled() {
        store.$_countWumpusKilled();
      },

      setMessage(message: string) {
        store.$_setMessage(message);
      },
    };
  }),
  withHooks({
    onInit(store) {
      store.syncHunterWithStorage();
    },
  }),
);
