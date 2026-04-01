import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Cell, Chars, Hunter } from '@hunt-the-bishomalo/shared-data';
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
  readonly selectedChar = input.required<Chars>();
  readonly size = input.required<number>();
  readonly isHunterCell = input.required<boolean>();
  readonly hunter = input<Hunter | null>(null);

  // Optimized inputs: pre-computed boolean flags to avoid signal overhead in large grids
  readonly showElements = input.required<boolean>();
  readonly showHunter = input.required<boolean>();
  readonly hasLantern = input.required<boolean>();
  readonly hasShield = input.required<boolean>();
}
