import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleComponent {
  blackout = input.required<boolean>();
}
