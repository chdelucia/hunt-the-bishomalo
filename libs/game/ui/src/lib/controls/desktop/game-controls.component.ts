import { ChangeDetectionStrategy, Component, inject, isDevMode, output, signal } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';
import { RouteTypes } from '@hunt-the-bishomalo/data';
import { Router } from '@angular/router';
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';

@Component({
  selector: 'lib-game-controls',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './game-controls.component.html',
  styleUrl: './game-controls.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameControlsComponent {
  readonly gameStore = inject(GAME_STORE_TOKEN);
  readonly isVisible = signal(false);

  readonly newGameRequested = output<void>();
  readonly moveForwardRequested = output<void>();
  readonly turnLeftRequested = output<void>();
  readonly turnRightRequested = output<void>();
  readonly shootArrowRequested = output<void>();
  readonly resetGameRequested = output<void>();

  private readonly router = inject(Router);

  newGame(): void {
    this.newGameRequested.emit();
    this.router.navigate([RouteTypes.SETTINGS]);
  }

  navigateToControls() {
    this.router.navigate([RouteTypes.RULES]);
  }

  moveForward(): void {
    this.moveForwardRequested.emit();
  }

  turnLeft(): void {
    this.turnLeftRequested.emit();
  }

  turnRight(): void {
    this.turnRightRequested.emit();
  }

  shootArrow(): void {
    this.shootArrowRequested.emit();
  }

  resetGame(): void {
    if (isDevMode()) this.resetGameRequested.emit();
  }

  toggle(): void {
    this.isVisible.update((value) => !value);
  }

  toggleSound(): void {
    this.gameStore.updateGame({
      settings: {
        ...this.gameStore.settings(),
        soundEnabled: !this.gameStore.soundEnabled(),
      },
    });
  }
}
