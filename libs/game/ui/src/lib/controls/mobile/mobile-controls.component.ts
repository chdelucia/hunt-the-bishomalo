import { Component, inject, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';

/**
 * @description
 * Component to display the mobile controls.
 */
@Component({
  selector: 'lib-mobile-controls',
  standalone: true,
  imports: [NgOptimizedImage, TranslocoModule],
  templateUrl: './mobile-controls.component.html',
  styleUrl: './mobile-controls.component.scss',
})
export class MobileControlsComponent {
  readonly gameStore = inject(GAME_STORE_TOKEN);
  isFinish = input.required<boolean>();

  readonly moveForwardRequested = output<void>();
  readonly turnRightRequested = output<void>();
  readonly shootArrowRequested = output<void>();

  moveForward(): void {
    this.moveForwardRequested.emit();
  }

  turnRight(): void {
    this.turnRightRequested.emit();
  }

  shootArrow(): void {
    this.shootArrowRequested.emit();
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
