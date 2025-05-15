import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreboardComponent } from "../index";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, ScoreboardComponent, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  isOpen = signal(false);

  toggleMenu(): void {
    this.isOpen.update((open) => !open);
  }
}
