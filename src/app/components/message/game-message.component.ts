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
  
  newGame(): void {
    this.gameEngine.newGame();
  }
}
