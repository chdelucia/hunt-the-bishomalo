import { computed, inject } from '@angular/core';
import {
  signalStoreFeature,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { GameSettings, Chars } from '@hunt-the-bishomalo/shared-data';
import { LocalstorageService } from '../../services';

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
    withMethods((store, localStorage = inject(LocalstorageService)) => ({
      $_updateSettings(settings: GameSettings) {
        patchState(store, { settings });
        localStorage.setValue(storageSettingsKey, settings);
      },
      $_setUnlockedChars(unlockedChars: Chars[]) {
        patchState(store, { unlockedChars });
      },
      $_resetConfig() {
        localStorage.clearValue(storageSettingsKey);
        patchState(store, { settings: {} as GameSettings });
      },
    })),
  );
}
