import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ASSETS_BASE_URL } from '@hunt-the-bishomalo/shared-data';
import { ControlButtonComponent } from '../button/control-button.component';

/**
 * @description
 * Component to display the mobile controls.
 */
@Component({
  selector: 'lib-mobile-controls',
  standalone: true,
  imports: [TranslocoModule, ControlButtonComponent],
  templateUrl: './mobile-controls.component.html',
  styleUrl: './mobile-controls.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileControlsComponent {
  protected readonly ASSETS_BASE_URL = ASSETS_BASE_URL;
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
