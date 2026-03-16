import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { Cell } from '@hunt-the-bishomalo/data';
import { GameStore } from '@hunt-the-bishomalo/core/store';
import { CellContentComponent } from './content/cell-content.component';
import { HunterComponent } from './hunter/hunter.component';

@Component({
  selector: 'lib-game-cell',
  standalone: true,
  imports: [CellContentComponent, HunterComponent],
  templateUrl: './game-cell.component.html',
  styleUrl: './game-cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCellComponent {
  readonly cell = input.required<Cell>();

  readonly gameStore = inject(GameStore);

  settings = this.gameStore.settings;
  blackout = this.gameStore.blackout;

  readonly hasLantern = computed(
    () => this.gameStore.inventory().some((x) => x.effect === 'lantern') && this.blackout(),
  );
  readonly hasShield = computed(() =>
    this.gameStore.inventory().some((x) => x.effect === 'shield'),
  );

  readonly showElements = computed(() => {
    const cell = this.cell();
    return (
      !this.gameStore.isAlive() ||
      this.gameStore.hasWon() ||
      cell.visited ||
      cell.content?.alt === 'secret'
    );
  });

  readonly isHunterCell = computed(() => {
    const currentCell = this.gameStore.currentCell();
    return currentCell === this.cell();
  });

  readonly showHunter = computed(() => this.isHunterCell() && this.gameStore.isAlive());
}
