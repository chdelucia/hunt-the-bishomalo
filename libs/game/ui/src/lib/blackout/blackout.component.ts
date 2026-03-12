import { Component, inject, OnInit } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';
import { GameSound } from '@hunt-the-bishomalo/data';
import { AchieveTypes, ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { GameSoundService } from '@hunt-the-bishomalo/game/data-access';

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
