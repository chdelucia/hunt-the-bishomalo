import { Component, input, signal } from '@angular/core';
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

  livesArray = signal<number[]>(Array(8).fill(0));

}

