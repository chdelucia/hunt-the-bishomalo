import {
  signalStoreFeature,
  withState,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { Cell } from '../../models';

export const initialStatus = {
  board: [] as Cell[][],
  message: '',
  wumpusKilled: 0,
  isAlive: true,
  hasWon: false,
  lives: 8,
  isEatenByWumpus: false,
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
        hasWon?: boolean;
        lives?: number;
        isEatenByWumpus?: boolean;
      }) {
        patchState(store, (state) => ({ ...state, ...partial }));
      },
      $_setMessage(message: string) {
        patchState(store, { message });
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
