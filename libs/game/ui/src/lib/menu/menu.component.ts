import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { RouteTypes } from '@hunt-the-bishomalo/data';

@Component({
  selector: 'lib-menu',
  standalone: true,
  imports: [RouterModule, TranslocoModule, NgOptimizedImage],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
