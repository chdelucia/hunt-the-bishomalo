import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { GameEngineService } from '@hunt-the-bishomalo/game/data-access';
import { RouteTypes } from '@hunt-the-bishomalo/data';

@Component({
  selector: 'lib-menu',
  standalone: true,
  imports: [RouterModule, TranslocoModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  isOpen = signal(false);
  private readonly gameEngine = inject(GameEngineService);
  private readonly router = inject(Router);

  readonly ROUTES = RouteTypes;

  toggleMenu(): void {
    this.isOpen.update((open) => !open);
  }

  nagivateTo(url: string): void {
    this.toggleMenu();
    this.router.navigateByUrl(`/${url}`);
  }

  newGame(): void {
    this.gameEngine.newGame();
    this.nagivateTo(RouteTypes.SETTINGS);
  }
}
