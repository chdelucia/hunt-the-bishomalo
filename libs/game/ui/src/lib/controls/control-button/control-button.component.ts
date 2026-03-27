import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-control-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './control-button.component.html',
  styleUrl: './control-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlButtonComponent {
  label = input.required<string>();
  icon = input<string>();
  ariaLabel = input<string>();
  customClass = input<string>('');
  clickEvent = output<void>();

  onClick(): void {
    this.clickEvent.emit();
  }
}
