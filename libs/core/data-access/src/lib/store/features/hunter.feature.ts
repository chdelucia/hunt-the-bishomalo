import { computed } from '@angular/core';
import {
  signalStoreFeature,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { Hunter, Direction } from '@hunt-the-bishomalo/shared-data';

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
      x: computed(() => hunter().x),
      y: computed(() => hunter().y),
      direction: computed(() => hunter().direction),
      arrows: computed(() => hunter().arrows),
      hasGold: computed(() => hunter().hasGold),
      gold: computed(() => hunter().gold),
      inventory: computed(() => hunter().inventory),
    })),
    withMethods((store) => ({
      $_updateHunter(partial: Partial<Hunter>) {
        patchState(store, (state) => {
          const keys = Object.keys(partial) as (keyof Hunter)[];
          const hasChange = keys.some((key) => state.hunter[key] !== partial[key]);
          return hasChange ? { hunter: { ...state.hunter, ...partial } } : state;
        });
      },
      $_resetHunter() {
        patchState(store, { hunter: initialHunter });
      },
    })),
  );
}
