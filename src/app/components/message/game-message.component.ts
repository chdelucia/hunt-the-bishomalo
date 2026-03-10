import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';
import { GameSettings, RouteTypes } from '@hunt-the-bishomalo/data';
import { GameEngineService } from '@hunt-the-bishomalo/core/services';
import { Router } from '@angular/router';
import { GameMessageDisplayComponent } from './game-message-display.component';
import { GameMessageActionsComponent } from './game-message-actions.component';

@Component({
  selector: 'app-game-message',
  standalone: true,
  imports: [TranslocoModule, GameMessageDisplayComponent, GameMessageActionsComponent],
  templateUrl: './game-message.component.html',
  styleUrl: './game-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameMessageComponent {
  private readonly gameEngine = inject(GameEngineService);
  private readonly router = inject(Router);
  readonly message = input.required<string>();
  readonly isAlive = input.required<boolean>();
  readonly hasWon = input.required<boolean>();
  readonly settings = input.required<GameSettings>();
  readonly lives = input.required<number>();

  readonly _bolaDrac = computed(() => this.message().includes('drac'));
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
    this.router.navigate([RouteTypes.RESULTS], {
      state: {
        fromSecretPath: true,
      },
    });
  }

  goToBoss(): void {
    this.router.navigate([RouteTypes.BOSS], {
      state: {
        fromSecretPath: true,
      },
    });
  }
}
