import { inject, Injectable } from '@angular/core';
import { GameStore } from '@hunt-the-bishomalo/game-data-access';
import { GameSettings } from '@hunt-the-bishomalo/models';

@Injectable({ providedIn: 'root' })
export class SettingsFacade {
  private readonly store = inject(GameStore);

  // Expose signals
  readonly settings = this.store.settings;

  // Expose methods
  updateSettings(settings: Partial<GameSettings>) {
    this.store.$_updateSettings(settings);
  }

  resetConfig() {
    this.store.$_resetConfig();
  }
}
