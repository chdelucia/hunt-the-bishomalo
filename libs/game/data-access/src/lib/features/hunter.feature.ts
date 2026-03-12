import { computed } from '@angular/core';
import {
  signalStoreFeature,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { Hunter, Direction } from '@hunt-the-bishomalo/data';

export const initialHunter: Hunter = {
  x: 0,
  y: 0,
  direction: Direction.RIGHT,
  arrows: 1,
  hasGold: false,
  inventory: [],
  gold: 0,
};

export function withHunterFeature() {
  return signalStoreFeature(
    withState({ hunter: initialHunter }),
    withComputed(({ hunter }) => ({
      arrows: computed(() => hunter().arrows),
      dragonballs: computed(() => hunter().dragonballs),
      hasGold: computed(() => hunter().hasGold),
      gold: computed(() => hunter().gold),
      inventory: computed(() => hunter().inventory),
    })),
    withMethods((store) => ({
      $_updateHunter(partial: Partial<Hunter>) {
        patchState(store, (state) => ({ hunter: { ...state.hunter, ...partial } }));
      },
      $_resetHunter() {
        patchState(store, { hunter: initialHunter });
      },
    })),
  );
}
