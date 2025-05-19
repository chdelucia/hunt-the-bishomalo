import { ChangeDetectionStrategy, Component, computed, input, isDevMode } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Cell, Chars, GameSettings, Hunter } from '../../models';

@Component({
  selector: 'app-game-cell',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './game-cell.component.html',
  styleUrl: './game-cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCellComponent {
  cell = input.required<Cell>();
  hunter = input.required<Hunter>();
  settings = input.required<GameSettings>();

  readonly showItems = isDevMode();

  readonly isHunterCell = (cell: Cell) =>
    computed(() => {
      const { x, y } = this.hunter();
      return x === cell.x && y === cell.y;
    });

  readonly rotation = computed(() => {
    switch (this.hunter().direction) {
      case 0:
        return 270;
      case 1:
        return 0;
      case 2:
        return 90;
      case 3:
        return 180;
      default:
        return 0;
    }
  });

  //TODO mucha perdida memoria aqui
  readonly bowImage = computed(() => {
    const { arrows } = this.hunter();
    const { selectedChar } = this.settings();

    const extension = selectedChar === Chars.DEFAULT ? 'svg' : 'png';
    if (arrows) return `chars/${selectedChar}/bow.${extension}`;
    return `chars/${selectedChar}/bowempty.${extension}`;
  });
}
