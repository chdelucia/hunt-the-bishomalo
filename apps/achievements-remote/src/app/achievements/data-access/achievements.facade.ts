import { inject, Injectable, signal } from '@angular/core';
import { MiniBusService } from './mini-bus.service';

const ACHIEVEMENTS_EVENT = 'ACHIEVEMENTS_CONFIG';

@Injectable({ providedIn: 'root' })
export class AchievementsFacade {
  private readonly bus = inject(MiniBusService);
  config = signal<{ appId: string } | null>(null);

  constructor() {
    this.bus.listen(ACHIEVEMENTS_EVENT, (config) => {
      this.config.set(config);
    });
  }
}
