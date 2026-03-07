import { Component, inject, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { GameEngineService } from '@hunt-the-bishomalo/shared-services';
import { AchievementService } from '@hunt-the-bishomalo/shared-services';
import { AchieveTypes } from '@hunt-the-bishomalo/shared-models';

@Component({
  selector: 'app-mobile-controls',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, TranslocoModule],
  templateUrl: './mobile-controls.component.html',
  styleUrl: './mobile-controls.component.scss',
})
export class MobileControlsComponent {
  isFinish = input.required<boolean>();

  private readonly game = inject(GameEngineService);
  private readonly achieve = inject(AchievementService);

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
