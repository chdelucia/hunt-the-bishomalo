import { Component, inject, output, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { ASSETS_BASE_URL, RouteTypes } from '@hunt-the-bishomalo/shared-data';

@Component({
  selector: 'lib-menu',
  standalone: true,
  imports: [RouterModule, TranslocoModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  protected readonly ASSETS_BASE_URL = ASSETS_BASE_URL;
  readonly isOpen = signal(false);
  readonly newGameRequested = output<void>();

  private readonly router = inject(Router);

  readonly ROUTES = RouteTypes;

  toggleMenu(): void {
    this.isOpen.update((open) => !open);
  }

  navigateTo(url: string): void {
    this.toggleMenu();
    this.router.navigateByUrl(`/${url}`);
  }

  newGame(): void {
    this.newGameRequested.emit();
    this.navigateTo(RouteTypes.SETTINGS);
  }
}
