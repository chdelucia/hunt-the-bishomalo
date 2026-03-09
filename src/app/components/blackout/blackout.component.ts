import { Component, inject } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';
import { AchieveTypes, GameSound } from '@hunt-the-bishomalo/data';
import { GameSoundService } from '@hunt-the-bishomalo/core/services';
import { AchievementService } from '@hunt-the-bishomalo/achievements';

@Component({
  selector: 'app-blackout',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './blackout.component.html',
  styleUrl: './blackout.component.scss',
})
export class BlackoutComponent {
  readonly sound = inject(GameSoundService);
  readonly achieve = inject(AchievementService);

  constructor() {
    this.sound.playSound(GameSound.BLACKOUT, false);
    this.achieve.activeAchievement(AchieveTypes.BLACKOUT);
  }
}
