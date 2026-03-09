import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-game-lives',
  imports: [],
  standalone: true,
  templateUrl: './game-lives.component.html',
  styleUrl: './game-lives.component.scss',
})
export class GameLivesComponent {
  lives = input.required<number>();
  maxLives = input.required<number>();

  livesArray = computed(() => Array(this.maxLives()).fill(0));
}
