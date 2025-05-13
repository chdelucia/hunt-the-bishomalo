import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-title',
  imports: [CommonModule],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleComponent {
  blackout = input.required<boolean>();
}
