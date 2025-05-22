import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameSettings, RouteTypes } from 'src/app/models';
import { GameEngineService } from 'src/app/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-message.component.html',
  styleUrl: './game-message.component.scss',
})
export class GameMessageComponent {
  private readonly gameEngine = inject(GameEngineService);
  private readonly router = inject(Router);

  readonly message = input.required<string>();
  readonly isAlive = input.required<boolean>();
  readonly hasWon = input.required<boolean>();
  readonly settings = input.required<GameSettings>();
  readonly lives = input.required<number>();

  readonly _hasMessage = computed(() => !!this.message() && !!this.settings().size);
  readonly _shouldShowRetry = computed(() => !this.isAlive() && !!this.settings().size);
  readonly _shouldShowNextLevel = computed(() => this.hasWon() && !!this.settings().size);
  readonly _showCongrats = computed(
    () => this.settings().size < this.settings().difficulty.maxLevels + 3,
  );

  restartGame(): void {
    this.gameEngine.initGame();
  }

  nextLevel(): void {
    this.router.navigate([RouteTypes.SHOP], {
      state: {
        fromSecretPath: true,
      },
    });
  }

  newGame(): void {
    this.router.navigate([RouteTypes.RESULTS]);
  }

  goToBoss(): void {
    this.router.navigate([RouteTypes.BOSS], {
      state: {
        fromSecretPath: true,
      },
    });
  }
}
