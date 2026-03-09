import { ChangeDetectionStrategy, Component, inject, isDevMode } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToastComponent, MenuComponent, GameControlsComponent } from '@hunt-the-bishomalo/shared-ui';
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
    if (isDevMode() || (window as any).Cypress) {
      (window as any).gameStore = this.game;
    }
  }
}
