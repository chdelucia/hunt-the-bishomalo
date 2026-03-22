import { Component, inject, output, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { RouteTypes } from '@hunt-the-bishomalo/shared-data';

@Component({
  selector: 'lib-menu',
  standalone: true,
  imports: [RouterModule, TranslocoModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  readonly isOpen = signal(false);
  readonly newGameRequested = output<void>();

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
    this.newGameRequested.emit();
    this.nagivateTo(RouteTypes.SETTINGS);
  }
}
