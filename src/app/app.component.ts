import { ChangeDetectionStrategy, Component, HostListener, inject, isDevMode } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToastComponent, MenuComponent, GameControlsComponent } from '@hunt-the-bishomalo/game/ui';
import { GameStore } from '@hunt-the-bishomalo/core/store';
import { GameEngineService, KeyboardManagerService } from '@hunt-the-bishomalo/game/data-access';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';

@Component({
  imports: [RouterOutlet, ToastComponent, MenuComponent, GameControlsComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'hunt-the-bishomalo';
  readonly game = inject(GameStore);
  readonly achieve = inject(ACHIEVEMENT_SERVICE);
  private readonly keyboardManager = inject(KeyboardManagerService);
  private readonly gameEngine = inject(GameEngineService);

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    this.keyboardManager.handleKeyDown(event);
  }

  handleNewGame(): void {
    this.gameEngine.newGame();
  }

  handleRestart(): void {
    this.gameEngine.initGame();
  }

  handleMoveForward(): void {
    this.gameEngine.moveForward();
  }

  handleTurnLeft(): void {
    this.gameEngine.turnLeft();
  }

  handleTurnRight(): void {
    this.gameEngine.turnRight();
  }

  handleShootArrow(): void {
    this.gameEngine.shootArrow();
  }

  constructor() {
    if (isDevMode() || (globalThis as unknown as { Cypress: unknown }).Cypress) {
      (globalThis as unknown as { gameStore: unknown }).gameStore = this.game;
    }
  }
}
