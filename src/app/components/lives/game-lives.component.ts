import { Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-lives',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './game-lives.component.html',
  styleUrl: './game-lives.component.scss',
})
export class GameLivesComponent {
  lives = input.required<number>();
  maxLives = input.required<number>();

  livesArray = computed(() => Array(this.maxLives()).fill(0));
}
