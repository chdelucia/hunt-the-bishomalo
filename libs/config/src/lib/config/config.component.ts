import { Component } from '@angular/core';

import { GameConfigComponent } from './game-config.component';
import { TitleComponent } from '@hunt-the-bishomalo/shared/ui';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'lib-config',
  standalone: true,
  imports: [GameConfigComponent, TitleComponent, TranslocoModule],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
})
export class ConfigComponent {}
