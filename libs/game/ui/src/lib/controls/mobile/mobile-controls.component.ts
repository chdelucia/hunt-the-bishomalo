import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'lib-mobile-controls',
  standalone: true,
  imports: [NgOptimizedImage, TranslocoModule],
  templateUrl: './mobile-controls.component.html',
  styleUrl: './mobile-controls.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileControlsComponent {
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
}
