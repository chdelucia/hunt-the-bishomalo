import { inject, Injectable, signal } from '@angular/core';
import { MiniBusService } from '@hunt-the-bishomalo/core/data-access';

const ACHIEVEMENTS_EVENT = 'ACHIEVEMENTS_CONFIG';

@Injectable({ providedIn: 'root' })
export class AchievementsFacade {
  private readonly bus = inject(MiniBusService);
  config = signal<{ appId: string; finalAchievementId?: string } | null>(null);

  constructor() {
    this.bus.listen(ACHIEVEMENTS_EVENT, (config) => {
      this.config.set(config);
    });
  }
}
