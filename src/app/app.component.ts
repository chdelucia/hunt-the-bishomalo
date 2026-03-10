import { ChangeDetectionStrategy, Component, inject, isDevMode } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToastComponent } from './components';
import { MenuComponent } from './components/menu/menu.component';
import { GameControlsComponent } from './components/controls/game-controls.component';
import { GameStore } from '@hunt-the-bishomalo/core/store';

@Component({
  imports: [RouterOutlet, ToastComponent, MenuComponent, GameControlsComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'hunt-the-bishomalo';
  readonly game = inject(GameStore);

  constructor() {
    if (isDevMode() || (window as unknown as { Cypress: unknown }).Cypress) {
      (window as unknown as { gameStore: unknown }).gameStore = this.game;
    }
  }
}
