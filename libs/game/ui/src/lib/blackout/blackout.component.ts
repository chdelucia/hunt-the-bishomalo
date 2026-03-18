import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'lib-blackout',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './blackout.component.html',
  styleUrl: './blackout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlackoutComponent {}
