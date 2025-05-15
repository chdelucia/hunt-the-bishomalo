import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameSettings } from 'src/app/models';
import { GameEngineService } from 'src/app/services';

@Component({
  selector: 'app-game-message',
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

  restartGame(): void {
    this.gameEngine.initGame();  
  }
  
  nextLevel(): void {
    const size = this.settings().size + 1;
    const pits = this.calculatePits(size);
    const wumpus = this.calculateWumpus(size);
    const arrows = wumpus;

    const newSettings = {
      ...this.settings(),
      size,
      pits,
      wumpus,
      arrows
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
    const basePercentage = 0.03;
    return Math.max(1, Math.floor(totalCells * basePercentage));
  }
}
