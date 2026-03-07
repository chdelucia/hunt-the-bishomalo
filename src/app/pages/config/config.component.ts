import { Component } from '@angular/core';

import { GameConfigComponent } from '../../components/config/game-config.component';
import { TitleComponent } from '../../components/title/title.component';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-config',
  imports: [GameConfigComponent, TitleComponent, TranslocoModule],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
})
export class ConfigComponent {}
