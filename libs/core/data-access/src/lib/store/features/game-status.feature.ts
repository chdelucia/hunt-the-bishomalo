import {
  signalStoreFeature,
  withState,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { Cell } from '@hunt-the-bishomalo/shared-data';

export const initialStatus = {
  board: [] as Cell[][],
  message: '',
  wumpusKilled: 0,
  isAlive: true,
  deathByWumpus: false,
  hasWon: false,
  lives: 8,
};

export function withGameStatusFeature() {
  return signalStoreFeature(
    withState(initialStatus),
    withMethods((store) => ({
      $_updateGameStatus(partial: {
        board?: Cell[][];
        message?: string;
        wumpusKilled?: number;
        isAlive?: boolean;
        deathByWumpus?: boolean;
        hasWon?: boolean;
        lives?: number;
      }) {
        patchState(store, (state) => {
          const keys = Object.keys(partial) as (keyof typeof partial)[];
          const hasChange = keys.some((key) => state[key] !== partial[key]);
          return hasChange ? { ...state, ...partial } : state;
        });
      },
      $_setMessage(message: string) {
        patchState(store, (state) => (state.message === message ? state : { message }));
      },
      $_countWumpusKilled() {
        patchState(store, (state) => ({ wumpusKilled: state.wumpusKilled + 1 }));
      },
      $_resetGameStatus() {
        patchState(store, initialStatus);
      },
    })),
  );
}
