import { Component, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

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
  isFinish = input.required<boolean>();
  soundEnabled = input.required<boolean>();

  readonly moveForwardRequested = output<void>();
  readonly turnLeftRequested = output<void>();
  readonly turnRightRequested = output<void>();
  readonly shootArrowRequested = output<void>();
  readonly toggleSoundRequested = output<void>();

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

  toggleSound(): void {
    this.toggleSoundRequested.emit();
  }
}
