import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'lib-control-button',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './control-button.component.html',
  styleUrl: './control-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlButtonComponent {
  ariaLabel = input.required<string>();
  iconUrl = input<string | null>(null);
  label = input<string | null>(null);
  priority = input<boolean>(false);

  readonly clicked = output<void>();

  onClick(): void {
    this.clicked.emit();
  }
}
