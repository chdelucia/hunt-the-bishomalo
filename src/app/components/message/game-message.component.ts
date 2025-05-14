import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameSettings } from 'src/app/models';

@Component({
  selector: 'app-game-message',
  imports: [CommonModule],
  templateUrl: './game-message.component.html',
  styleUrl: './game-message.component.scss',
})
export class GameMessageComponent {
  message = input.required<string>();
  isAlive = input.required<boolean>();
  hasWon = input.required<boolean>();
  settings = input.required<GameSettings>();
}
