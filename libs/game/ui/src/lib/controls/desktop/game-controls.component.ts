import { ChangeDetectionStrategy, Component, input, isDevMode, output, signal } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';

/**
 * @description
 * Component to display the game controls on desktop devices.
 */
@Component({
  selector: 'lib-game-controls',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './game-controls.component.html',
  styleUrl: './game-controls.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameControlsComponent {
  soundEnabled = input.required<boolean>();
  readonly isVisible = signal(false);

  readonly newGameRequested = output<void>();
  readonly navigateToControlsRequested = output<void>();
  readonly moveForwardRequested = output<void>();
  readonly turnLeftRequested = output<void>();
  readonly turnRightRequested = output<void>();
  readonly shootArrowRequested = output<void>();
  readonly resetGameRequested = output<void>();
  readonly toggleSoundRequested = output<void>();

  newGame(): void {
    this.newGameRequested.emit();
  }

  navigateToControls() {
    this.navigateToControlsRequested.emit();
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
    this.toggleSoundRequested.emit();
  }
}
