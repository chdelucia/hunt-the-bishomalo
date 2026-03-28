import { Component, input, output } from '@angular/core';

@Component({
  selector: 'lib-control-button',
  standalone: true,
  imports: [],
  templateUrl: './control-button.component.html',
  styleUrl: './control-button.component.scss',
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
