import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from '@hunt-the-bishomalo/shared-ui';
import { TranslocoModule } from '@jsverse/transloco';
import { GAME_CONFIG_COMPONENT } from '@hunt-the-bishomalo/shared-data';

@Component({
  selector: 'lib-config',
  standalone: true,
  imports: [CommonModule, TitleComponent, TranslocoModule],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigComponent {
  readonly configComponent = inject(GAME_CONFIG_COMPONENT, { optional: true });
}
