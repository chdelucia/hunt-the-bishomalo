import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'lib-title',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleComponent {
  blackout = input.required<boolean>();
}
