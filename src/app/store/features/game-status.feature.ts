import { computed } from '@angular/core';
import { signalStoreFeature, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { Cell } from '../../models';

export const initialStatus = {
  board: [] as Cell[][],
  message: '',
  wumpusKilled: 0,
  isAlive: true,
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
        hasWon?: boolean;
        lives?: number;
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
      }
    }))
  );
}
