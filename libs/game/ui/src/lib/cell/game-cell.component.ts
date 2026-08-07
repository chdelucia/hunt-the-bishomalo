import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Cell } from '@hunt-the-bishomalo/shared-data';

@Component({
  selector: 'lib-game-cell',
  standalone: true,
  imports: [],
  templateUrl: './game-cell.component.html',
  styleUrl: './game-cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCellComponent {
  readonly cell = input.required<Cell>();
  readonly active = input<boolean>(false);
}
