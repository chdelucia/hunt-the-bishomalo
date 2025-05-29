import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from "@jsverse/transloco";
import { AchieveTypes, GameSound } from 'src/app/models';
import { GameSoundService } from 'src/app/services';
import { AchievementService } from 'src/app/services/achievement/achievement.service';

@Component({
  selector: 'app-blackout',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './blackout.component.html',
  styleUrl: './blackout.component.scss',
})
export class BlackoutComponent implements OnInit {
  readonly sound = inject(GameSoundService);
  readonly achieve = inject(AchievementService);

  ngOnInit(): void {
    this.sound.playSound(GameSound.BLACKOUT, false);
    this.achieve.activeAchievement(AchieveTypes.BLACKOUT);
  }
}
