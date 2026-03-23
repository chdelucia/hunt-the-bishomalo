import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { Cell, Chars, GameItem, Hunter } from '@hunt-the-bishomalo/shared-data';
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
  readonly inventory = input<GameItem[]>([]);
  readonly selectedChar = input.required<Chars>();
  readonly size = input.required<number>();
  readonly blackout = input.required<boolean>();
  readonly isHunterCell = input.required<boolean>();
  readonly hunter = input<Hunter | null>(null);

  readonly showElements = computed(() => {
    const cell = this.cell();
    return !this.isAlive() || this.hasWon() || cell.visited || cell.content?.alt === 'secret';
  });

  readonly showHunter = computed(() => this.isHunterCell() && this.isAlive() && !!this.hunter());

  readonly hasLantern = computed(
    () => !!this.blackout() && this.inventory().some((x) => x.effect === 'lantern'),
  );
  readonly hasShield = computed(() => this.inventory().some((x) => x.effect === 'shield'));
}
