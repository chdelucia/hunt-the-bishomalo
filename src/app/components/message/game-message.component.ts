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
  readonly lives = input.required<number>();

  readonly _hasMessage = computed(() => !!this.message() && !!this.settings().size);
  readonly _shouldShowRetry = computed(() => !this.isAlive() && !!this.settings().size);
  readonly _shouldShowNextLevel = computed(() => this.hasWon() && !!this.settings().size);
  readonly _showCongrats = computed(() => this.settings().size < 20);
  readonly _hasCompletedAllLevels = computed(() => this.settings().size >= 20);

  restartGame(): void {
    this.gameEngine.initGame();  
  }
  
  nextLevel(): void {
    this.gameEngine.nextLevel();
  }

  newGame(): void{
    this.gameEngine.newGame();
  }

}
