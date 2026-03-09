import { ChangeDetectionStrategy, Component, inject, isDevMode } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ToastComponent } from './components';
import { MenuComponent } from './components/menu/menu.component';
import { GameControlsComponent } from './components/controls/game-controls.component';
import { GameStore } from '@hunt-the-bishomalo/core/store';

@Component({
  imports: [RouterModule, ToastComponent, MenuComponent, GameControlsComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'hunt-the-bishomalo';
  readonly game = inject(GameStore);

  constructor() {
    if (isDevMode() || (window as any).Cypress) {
      (window as any).gameStore = this.game;
    }
  }
}
