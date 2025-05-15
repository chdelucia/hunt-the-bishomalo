import { ChangeDetectionStrategy, Component, HostListener, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from 'src/app/services/engine/game-engine.service';
import { AchievementService } from 'src/app/services/achievement/achievement.service';
import { AchieveTypes } from 'src/app/models';

@Component({
  selector: 'app-game-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-controls.component.html',
  styleUrl: './game-controls.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameControlsComponent {
  isVisible = signal(false);

  private readonly game = inject(GameEngineService);
  private readonly achieve = inject(AchievementService);
  readonly arrows = input.required<number>();

  private readonly keyActionMap: Record<string, () => void> = {
    ArrowUp: () => this.moveForward(),
    Space: () => this.shootArrow(),
    ArrowLeft: () => this.turnLeft(),
    ArrowRight: () => this.turnRight(),
    Enter: () => this.shootArrow(),
    KeyR: () => this.resetGame(),
    KeyW: () => { this.moveForward(); this.achieve.activeAchievement(AchieveTypes.GAMER)},
    KeyA: () => {this.turnLeft(); this.achieve.activeAchievement(AchieveTypes.GAMER)},
    KeyD: () => {this.turnRight(); this.achieve.activeAchievement(AchieveTypes.GAMER)},
    KeyQ: () => {this.exit(); this.achieve.activeAchievement(AchieveTypes.GAMER)},
    KeyN: () => this.game.newGame(),
    Escape: () => this.exit()
  };

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    const action = this.keyActionMap[event.code];
    if (action) {
      event.preventDefault();
      action();
    }
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

  exit(): void {
    this.game.exit();
  }

  resetGame(): void {
    this.game.initGame();
  }

  toggle(): void {
    this.isVisible.update((value) => !value);
  }

}
