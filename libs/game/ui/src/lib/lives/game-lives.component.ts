import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'lib-game-lives',
  imports: [],
  standalone: true,
  templateUrl: './game-lives.component.html',
  styleUrl: './game-lives.component.scss',
})
export class GameLivesComponent {
  lives = input.required<number>();
  maxLives = input.required<number>();

  livesArray = computed(() => new Array(this.maxLives()).fill(0));
}
