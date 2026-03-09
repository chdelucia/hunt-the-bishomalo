import { Component, inject, OnInit } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';
import { AchieveTypes, GameSound } from '@hunt-the-bishomalo/data';
import { GameSoundService, ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/core/services';

@Component({
  selector: 'app-blackout',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './blackout.component.html',
  styleUrl: './blackout.component.scss',
})
export class BlackoutComponent implements OnInit {
  readonly sound = inject(GameSoundService);
  readonly achieve = inject(ACHIEVEMENT_SERVICE);

  ngOnInit(): void {
    this.sound.playSound(GameSound.BLACKOUT, false);
    this.achieve.activeAchievement(AchieveTypes.BLACKOUT);
  }
}
