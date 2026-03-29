import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'lib-game-level',
  imports: [TranslocoModule],
  templateUrl: './game-level.component.html',
  styleUrl: './game-level.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameLevelComponent {
  readonly size = input.required<number>();

  readonly _level = computed(() => {
    const size = this.size();
    return size ? size - 4 + 1 : null;
  });
}
