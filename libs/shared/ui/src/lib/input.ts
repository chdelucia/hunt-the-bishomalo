import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly value = input<string | number>('');
  readonly type = input<'text' | 'number' | 'password' | 'email'>('text');
  readonly id = input<string>(`lib-input-${Math.random().toString(36).substr(2, 9)}`);
  readonly disabled = input<boolean>(false);
  readonly error = input<string>('');

  readonly valueChange = output<string | number>();

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const val = this.type() === 'number' ? Number(target.value) : target.value;
    this.valueChange.emit(val);
  }
}
