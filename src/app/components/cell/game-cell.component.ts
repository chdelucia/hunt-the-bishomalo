import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cell, Hunter } from '../../models';

@Component({
  selector: 'app-game-cell',
  imports: [CommonModule],
  templateUrl: './game-cell.component.html',
  styleUrl: './game-cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameCellComponent {
  cell = input.required<Cell>();
  hunter = input.required<Hunter>();

  readonly isHunterCell = (cell: Cell) => computed(() => {
    const { x, y } = this.hunter();
    return x === cell.x && y === cell.y;
  });

  readonly rotation = computed(() => {
    switch (this.hunter().direction) {
      case 0: return 270;
      case 1: return 0;
      case 2: return 90;
      case 3: return 180;
      default: return 0;
    }
  });

  readonly bowImage = computed(() => {
    const { arrows, hasGold } = this.hunter();
    if (arrows && hasGold) return 'bowgold.svg';
    if (arrows && !hasGold) return 'bow.svg';
    if (!arrows && hasGold) return 'bowgoldempty.svg';
    return 'bowempty.svg';
  });
}
