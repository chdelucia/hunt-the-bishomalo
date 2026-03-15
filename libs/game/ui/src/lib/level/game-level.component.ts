import { Component, computed, input } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';
import { GameSettings } from '@hunt-the-bishomalo/data';

@Component({
  selector: 'lib-game-level',
  imports: [TranslocoModule],
  templateUrl: './game-level.component.html',
  styleUrl: './game-level.component.scss',
})
export class GameLevelComponent {
  readonly settings = input.required<GameSettings>();

  readonly _level = computed(() => {
    const size = this.settings().size;
    return size ? size - 4 + 1 : null;
  });
}
