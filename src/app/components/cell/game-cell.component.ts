import { Component, computed, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { Cell, Chars, Direction } from '../../models';
import { GameStore } from 'src/app/store';

@Component({
  selector: 'app-game-cell',
  standalone: true,
  imports: [NgOptimizedImage, TranslocoModule],
  templateUrl: './game-cell.component.html',
  styleUrl: './game-cell.component.scss',
})
export class GameCellComponent {
  cell = input.required<Cell>();

  readonly gameStore = inject(GameStore);

  readonly settings = this.gameStore.settings;

  readonly hasLantern = computed(
    () => this.gameStore.inventory().some((x) => x.effect === 'lantern') && this.settings().blackout,
  );

  readonly hasShield = computed(() => this.gameStore.inventory().some((x) => x.effect === 'shield'));

  readonly showElements = computed(() => {
    const cell = this.cell();
    return (
      !this.gameStore.isAlive() ||
      this.gameStore.hasWon() ||
      cell.visited ||
      cell.content?.alt === 'secret'
    );
  });

  readonly showGoldIcon = computed(() => this.gameStore.hasGold() && this.settings().size < 12);

  readonly isHunterCell = computed(() => {
    const currentCell = this.gameStore.currentCell();
    return currentCell.x === this.cell().x && currentCell.y === this.cell().y;
  });

  readonly showHunter = computed(() => this.isHunterCell() && this.gameStore.isAlive());

  readonly rotation = computed(() => {
    const direction = this.gameStore.hunter().direction;
    switch (direction) {
      case Direction.UP:
        return 270;
      case Direction.RIGHT:
        return 0;
      case Direction.DOWN:
        return 90;
      case Direction.LEFT:
        return 180;
      default:
        return 0;
    }
  });

  readonly bowImage = computed(() => {
    const arrows = this.gameStore.arrows();
    const selectedChar = this.settings().selectedChar;

    const extension = selectedChar === Chars.DEFAULT ? 'svg' : 'png';
    const bowType = arrows ? 'bow' : 'bowempty';
    return `chars/${selectedChar}/${bowType}.${extension}`;
  });
}
