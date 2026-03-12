import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { GameStore } from '@hunt-the-bishomalo/core/store';
import { GameCellComponent } from '../cell/game-cell.component';
import { AppWumpusAttackAnimationComponent } from '../animations/attack/app-wumpus-attack-animation.component';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [GameCellComponent, AppWumpusAttackAnimationComponent],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameBoardComponent {
  readonly game = inject(GameStore);
  closeAnimation = output<void>();

  handleClose(): void {
    this.closeAnimation.emit();
  }
}
