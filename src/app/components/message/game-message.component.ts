import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameSettings } from 'src/app/models';
import { GameEngineService } from 'src/app/services';

@Component({
  selector: 'app-game-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-message.component.html',
  styleUrl: './game-message.component.scss',
})
export class GameMessageComponent {
  private readonly gameEngine = inject(GameEngineService);

  readonly message = input.required<string>();
  readonly isAlive = input.required<boolean>();
  readonly hasWon = input.required<boolean>();
  readonly settings = input.required<GameSettings>();

  readonly _level = computed(() => {
    const size = this.settings().size;
    return size ? size - 4 + 1 : null;
  });

  readonly _hasMessage = computed(() => !!this.message() && !!this.settings().size);


  readonly _shouldShowRetry = computed(() => !this.isAlive() && !!this.settings().size);
  readonly _shouldShowNextLevel = computed(() => this.hasWon() && !!this.settings().size);

  readonly _showCongrats = computed(() => this.settings().size < 20);
  readonly _hasCompletedAllLevels = computed(() => this.settings().size >= 20);


  restartGame(): void {
    this.gameEngine.initGame();  
  }
  
  nextLevel(): void {
    const size = this.settings().size + 1;

    const newSettings = {
      ...this.settings(),
      size,
      pits: this.calculatePits(size),
      wumpus: this.calculateWumpus(size),
      blackout: this.applyBlackoutChance(),
    };

    this.gameEngine.initGame(newSettings);
  }

  private calculatePits(size: number): number {
    const totalCells = size * size;
    const basePercentage = 0.10;
    return Math.max(1, Math.floor(totalCells * basePercentage));
  }

  private calculateWumpus(size: number): number {
    const totalCells = size * size;
    const basePercentage = 0.04;
    return Math.max(1, Math.floor(totalCells * basePercentage));
  }

  private applyBlackoutChance(): boolean {
      const blackoutChance = 0.08;
      return Math.random() < blackoutChance;
  }
}
