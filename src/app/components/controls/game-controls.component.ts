import {
  ChangeDetectionStrategy,
  Component,
  inject,
  isDevMode,
  signal,
} from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';
import { GameEngineService } from '@hunt-the-bishomalo/core/services';
import { RouteTypes } from '@hunt-the-bishomalo/data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-controls',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './game-controls.component.html',
  styleUrl: './game-controls.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameControlsComponent {
  isVisible = signal(false);

  private readonly game = inject(GameEngineService);
  private readonly router = inject(Router);

  newGame(): void {
    this.game.newGame();
    this.router.navigate([RouteTypes.SETTINGS]);
  }

  navigateToControls() {
    this.router.navigate([RouteTypes.RULES]);
  }

  moveForward(): void {
    this.game.moveForward();
  }

  turnLeft(): void {
    this.game.turnLeft();
  }

  turnRight(): void {
    this.game.turnRight();
  }

  shootArrow(): void {
    this.game.shootArrow();
  }

  resetGame(): void {
    if (isDevMode()) this.game.initGame();
  }

  toggle(): void {
    this.isVisible.update((value) => !value);
  }
}
