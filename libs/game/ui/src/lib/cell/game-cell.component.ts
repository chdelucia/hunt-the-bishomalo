import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { Cell, GameItem, GameSettings, Hunter } from '@hunt-the-bishomalo/data';
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
  readonly isAlive = input.required<boolean>();
  readonly hasWon = input.required<boolean>();
  readonly inventory = input.required<GameItem[]>();
  readonly settings = input.required<GameSettings>();
  readonly blackout = input.required<boolean>();
  readonly isHunterCell = input.required<boolean>();
  readonly hunter = input.required<Hunter>();

  readonly hasLantern = computed(
    () => this.inventory().some((x) => x.effect === 'lantern') && !!this.blackout(),
  );
  readonly hasShield = computed(() => this.inventory().some((x) => x.effect === 'shield'));

  readonly showElements = computed(() => {
    const cell = this.cell();
    return !this.isAlive() || this.hasWon() || cell.visited || cell.content?.alt === 'secret';
  });

  readonly showHunter = computed(() => this.isHunterCell() && this.isAlive());
}
