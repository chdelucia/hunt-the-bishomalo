import { ChangeDetectionStrategy, Component, HostListener, inject, isDevMode } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

import { ToastComponent, MenuComponent, GameControlsComponent } from '@hunt-the-bishomalo/game/ui';
import { GameStore } from '@hunt-the-bishomalo/core/store';
import { GameEngineService, KeyboardManagerService } from '@hunt-the-bishomalo/game/data-access';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { RouteTypes } from '@hunt-the-bishomalo/data';

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
  private readonly router = inject(Router);

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    this.keyboardManager.handleKeyDown(event);
  }

  handleNewGame(): void {
    this.gameEngine.newGame();
    this.router.navigate([RouteTypes.SETTINGS]);
  }

  handleNavigateToControls(): void {
    this.router.navigate([RouteTypes.RULES]);
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

  handleToggleSound(): void {
    this.game.updateGame({
      settings: {
        ...this.game.settings(),
        soundEnabled: !this.game.soundEnabled(),
      },
    });
  }

  constructor() {
    if (isDevMode() || (globalThis as unknown as { Cypress: unknown }).Cypress) {
      (globalThis as unknown as { gameStore: unknown }).gameStore = this.game;
    }
  }
}
