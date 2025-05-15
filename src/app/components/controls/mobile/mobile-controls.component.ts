import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from 'src/app/services';
import { AchievementService } from 'src/app/services/achievement/achievement.service';
import { AchieveTypes } from 'src/app/models';


@Component({
  selector: 'app-mobile-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-controls.component.html',
  styleUrl: './mobile-controls.component.scss',
})
export class MobileControlsComponent {
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
    this.achieve.activeAchievement(AchieveTypes.GAMER)
  }
}
