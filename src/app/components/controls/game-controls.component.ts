import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  isDevMode,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { GameEngineService } from 'src/app/services/engine/game-engine.service';
import { AchievementService } from 'src/app/services/achievement/achievement.service';
import { AchieveTypes, RouteTypes } from 'src/app/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-controls',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './game-controls.component.html',
  styleUrl: './game-controls.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameControlsComponent {
  isVisible = signal(false);

  private readonly game = inject(GameEngineService);
  private readonly achieve = inject(AchievementService);
  private readonly router = inject(Router);

  private readonly keyActionMap: Record<string, () => void> = {
    ArrowUp: () => this.moveForward(),
    Space: () => this.shootArrow(),
    ArrowLeft: () => this.turnLeft(),
    ArrowRight: () => this.turnRight(),
    Enter: () => this.shootArrow(),
    KeyR: () => this.resetGame(),
    KeyW: () => {
      this.moveForward();
      this.achieve.activeAchievement(AchieveTypes.GAMER);
    },
    KeyA: () => {
      this.turnLeft();
      this.achieve.activeAchievement(AchieveTypes.GAMER);
    },
    KeyD: () => {
      this.turnRight();
      this.achieve.activeAchievement(AchieveTypes.GAMER);
    },
    KeyN: () => this.newGame(),
    KeyI: () => this.navigateToControls(),
  };

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    const action = this.keyActionMap[event.code];
    if (action) {
      event.preventDefault();
      action();
    }
  }

  newGame():void {
    this.game.newGame()
    this.router.navigate([RouteTypes.SETTINGS]);
  }

  navigateToControls() {
    this.router.navigate([RouteTypes.RULES]);
  }

  moveForward(): void {
    this.game.moveForward();
  }

  turnLeft(): void {
    this.game.turnLeft();
  }

  turnRight(): void {
    this.game.turnRight();
  }

  shootArrow(): void {
    this.game.shootArrow();
  }

  resetGame(): void {
    if (isDevMode()) this.game.restartLevel();
  }

  toggle(): void {
    this.isVisible.update((value) => !value);
  }
}
