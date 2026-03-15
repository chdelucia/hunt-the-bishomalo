import { ChangeDetectionStrategy, Component, HostListener, inject, isDevMode } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToastComponent, MenuComponent, GameControlsComponent } from '@hunt-the-bishomalo/game/ui';
import { GameStore } from '@hunt-the-bishomalo/core/store';
import { KeyboardManagerService } from '@hunt-the-bishomalo/game/data-access';

@Component({
  imports: [RouterOutlet, ToastComponent, MenuComponent, GameControlsComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'hunt-the-bishomalo';
  readonly game = inject(GameStore);
  private readonly keyboardManager = inject(KeyboardManagerService);

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    this.keyboardManager.handleKeyDown(event);
  }

  constructor() {
    if (isDevMode() || (globalThis as unknown as { Cypress: unknown }).Cypress) {
      (globalThis as unknown as { gameStore: unknown }).gameStore = this.game;
    }
  }
}
