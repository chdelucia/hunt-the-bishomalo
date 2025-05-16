import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameSettings } from 'src/app/models';

@Component({
  selector: 'app-game-level',
  imports: [CommonModule],
  templateUrl: './game-level.component.html',
  styleUrl: './game-level.component.scss',
})
export class GameLevelComponent {
  readonly settings = input.required<GameSettings>();

  readonly _level = computed(() => {
    const size = this.settings().size;
    return size ? size - 4 + 1 : null;
  });
}
