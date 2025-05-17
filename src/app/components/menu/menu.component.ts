import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreboardComponent } from '../index';
import { Router, RouterModule } from '@angular/router';
import { GameEngineService } from 'src/app/services';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, ScoreboardComponent, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  isOpen = signal(false);
  gameEngine = inject(GameEngineService);
  router = inject(Router);

  toggleMenu(): void {
    this.isOpen.update((open) => !open);
  }

  nagivateTo(url: string): void {
    this.toggleMenu();
    this.router.navigateByUrl(`/${url}`);
  }

  newGame(): void {
    this.gameEngine.newGame();
    this.nagivateTo('home');
  }
}
