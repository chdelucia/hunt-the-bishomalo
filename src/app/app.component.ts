import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  isDevMode,
  OnInit,
  signal,
} from '@angular/core';
import {
  RouterOutlet,
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { filter } from 'rxjs';
import { TranslocoModule } from '@jsverse/transloco';
import { loadRemoteModule } from '@angular-architects/native-federation';

import { ToastComponent, MenuComponent, GameControlsComponent } from '@hunt-the-bishomalo/game/ui';
import { GAME_STORE_TOKEN, MINI_BUS_SERVICE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { KeyboardManagerService } from '@hunt-the-bishomalo/game/data-access';
import { GAME_ENGINE_TOKEN } from '@hunt-the-bishomalo/game/api';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { RouteTypes } from '@hunt-the-bishomalo/shared-data';

@Component({
  imports: [RouterOutlet, ToastComponent, MenuComponent, GameControlsComponent, TranslocoModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly RouteTypes = RouteTypes;
  title = 'hunt-the-bishomalo';
  readonly game = inject(GAME_STORE_TOKEN);
  readonly achieve = inject(ACHIEVEMENT_SERVICE);
  readonly gameEngine = inject(GAME_ENGINE_TOKEN);
  readonly router = inject(Router);
  private readonly keyboardManager = inject(KeyboardManagerService);
  private readonly miniBus = inject(MINI_BUS_SERVICE_TOKEN);

  readonly isRouteLoading = signal(false);
  private loaderTimer: ReturnType<typeof setTimeout> | undefined;

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

    loadRemoteModule('achievements', './Routes').catch((err) => {
      globalThis.console.warn('Preload failed', err);
    });

    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationStart ||
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel ||
            event instanceof NavigationError,
        ),
      )
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.loaderTimer = globalThis.setTimeout(() => {
            this.isRouteLoading.set(true);
          }, 300);
        } else {
          globalThis.clearTimeout(this.loaderTimer);
          this.isRouteLoading.set(false);
        }
      });
  }
}
