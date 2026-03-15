import { Component, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { GameEngineService } from '@hunt-the-bishomalo/game/data-access';
import { AchieveTypes, ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';

@Component({
  selector: 'lib-mobile-controls',
  standalone: true,
  imports: [NgOptimizedImage, TranslocoModule],
  templateUrl: './mobile-controls.component.html',
  styleUrl: './mobile-controls.component.scss',
})
export class MobileControlsComponent {
  isFinish = input.required<boolean>();

  private readonly game = inject(GameEngineService);
  private readonly achieve = inject(ACHIEVEMENT_SERVICE);

  moveForward(): void {
    this.game.moveForward();
  }

  turnRight(): void {
    this.game.turnRight();
  }

  shootArrow(): void {
    this.game.shootArrow();
    this.achieve.activeAchievement(AchieveTypes.GAMER);
  }
}
