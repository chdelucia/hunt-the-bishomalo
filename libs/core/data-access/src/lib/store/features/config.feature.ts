import { computed } from '@angular/core';
import {
  signalStoreFeature,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { GameSettings, Chars } from '@hunt-the-bishomalo/shared-data';

export const storageSettingsKey = 'hunt_the_bishomalo_settings';

export function withConfigFeature() {
  return signalStoreFeature(
    withState({
      settings: {} as GameSettings,
      unlockedChars: [Chars.DEFAULT] as Chars[],
    }),
    withComputed(({ settings }) => ({
      blackout: computed(() => settings().blackout),
      size: computed(() => settings().size),
      difficulty: computed(() => settings().difficulty),
      level: computed(() => (settings().size ? settings().size - 4 : 0)),
      selectedChar: computed(() => settings().selectedChar),
      startTime: computed(() => settings().startTime),
      soundEnabled: computed(() => settings().soundEnabled ?? true),
    })),
    withMethods((store) => ({
      $_updateSettings(settings: GameSettings) {
        patchState(store, (state) => (state.settings === settings ? state : { settings }));
      },
      $_setUnlockedChars(unlockedChars: Chars[]) {
        patchState(store, (state) => {
          if (
            state.unlockedChars === unlockedChars ||
            (state.unlockedChars.length === unlockedChars.length &&
              state.unlockedChars.every((val, index) => val === unlockedChars[index]))
          ) {
            return state;
          }
          return { unlockedChars };
        });
      },
      $_resetConfig() {
        patchState(store, { settings: {} as GameSettings });
      },
    })),
  );
}
