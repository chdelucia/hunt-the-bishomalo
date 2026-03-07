import { Component, computed, inject, input, isDevMode } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { Cell, Chars } from '../../models';
import { GameStore } from 'src/app/store';

@Component({
  selector: 'app-game-cell',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, TranslocoModule],
  templateUrl: './game-cell.component.html',
  styleUrl: './game-cell.component.scss',
})
export class GameCellComponent {
  cell = input.required<Cell>();

  readonly gameStore = inject(GameStore);

  settings = this.gameStore.settings();

  readonly hasLantern = computed(
    () => this.gameStore.inventory().find((x) => x.effect === 'lantern') && this.settings.blackout,
  );
  readonly hasShield = computed(() =>
    this.gameStore.inventory().find((x) => x.effect === 'shield'),
  );

  readonly showElements = computed(() => {
    const cell = this.cell();
    return (
      !this.gameStore.isAlive() ||
      this.gameStore.hasWon() ||
      cell.visited ||
      cell.content?.alt === 'secret'
    );
  });

  readonly showGoldIcon = computed(() => this.gameStore.hasGold() && this.settings.size < 12);

  readonly showHunter = computed(() => this.isHunterCell()() && this.gameStore.isAlive());

  readonly isHunterCell = () =>
    computed(() => {
      const currentCell = this.gameStore.currentCell();
      return currentCell === this.cell();
    });

  readonly rotation = computed(() => {
    switch (this.gameStore.hunter().direction) {
      case 0:
        return 270;
      case 1:
        return 0;
      case 2:
        return 90;
      case 3:
        return 180;
      default:
        return 0;
    }
  });

  readonly bowImage = computed(() => {
    const arrows = this.gameStore.arrows();
    const { selectedChar } = this.settings;

    const extension = selectedChar === Chars.DEFAULT ? 'svg' : 'png';
    if (arrows) return `chars/${selectedChar}/bow.${extension}`;
    return `chars/${selectedChar}/bowempty.${extension}`;
  });
}
