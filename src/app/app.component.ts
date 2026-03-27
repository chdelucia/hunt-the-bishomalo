import { ChangeDetectionStrategy, Component, HostListener, inject, isDevMode, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

import { ToastComponent, MenuComponent, GameControlsComponent } from '@hunt-the-bishomalo/game/ui';
import { GAME_STORE_TOKEN, MINI_BUS_SERVICE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { GAME_ENGINE_TOKEN, KEYBOARD_MANAGER_TOKEN } from '@hunt-the-bishomalo/game/api';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { RouteTypes } from '@hunt-the-bishomalo/shared-data';

@Component({
  imports: [RouterOutlet, ToastComponent, MenuComponent, GameControlsComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly RouteTypes = RouteTypes;
  title = 'hunt-the-bishomalo';
  readonly game = inject(GAME_STORE_TOKEN);
  readonly achieve = inject(ACHIEVEMENT_SERVICE);
  readonly gameEngine = inject(GAME_ENGINE_TOKEN);
  readonly router = inject(Router);
  private readonly keyboardManager = inject(KEYBOARD_MANAGER_TOKEN);
  private readonly miniBus = inject(MINI_BUS_SERVICE_TOKEN);

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    this.keyboardManager.handleKeyDown(event);
  }

  constructor() {
    if (isDevMode() || (globalThis as unknown as { Cypress: unknown }).Cypress) {
      (globalThis as unknown as { gameStore: unknown }).gameStore = this.game;
    }
  }

  ngOnInit() {
    this.miniBus.emit('ACHIEVEMENTS_CONFIG', { appId: 'hunt-the-bishomalo' });
  }
}
