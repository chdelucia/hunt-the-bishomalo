import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';
import { RouteTypes } from '@hunt-the-bishomalo/shared-data';
import { Router } from '@angular/router';
import { GameMessageDisplayComponent } from './game-message-display.component';
import { GameMessageActionsComponent } from './game-message-actions.component';

@Component({
  selector: 'lib-game-message',
  standalone: true,
  imports: [TranslocoModule, GameMessageDisplayComponent, GameMessageActionsComponent],
  templateUrl: './game-message.component.html',
  styleUrl: './game-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameMessageComponent {
  readonly restartRequested = output<void>();
  private readonly router = inject(Router);
  readonly message = input.required<string>();
  readonly isAlive = input.required<boolean>();
  readonly hasWon = input.required<boolean>();
  readonly size = input.required<number>();
  readonly maxLevels = input.required<number>();
  readonly lives = input.required<number>();

  readonly _bolaDrac = computed(() => this.message().includes('drac'));
  readonly _hasMessage = computed(() => !!this.message() && !!this.size());
  readonly _shouldShowRetry = computed(() => !this.isAlive() && !!this.size());
  readonly _shouldShowNextLevel = computed(() => this.hasWon() && !!this.size());
  readonly _showCongrats = computed(() => this.size() < this.maxLevels() + 3);

  restartGame(): void {
    this.restartRequested.emit();
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
