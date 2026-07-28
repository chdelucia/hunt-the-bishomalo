import { inject, Injectable } from '@angular/core';
import { Cell, CELL_CONTENTS, CellContentType, CellContent, GameSettings } from '@hunt-the-bishomalo/shared-data';
import { GridGeneratorService } from '@hunt-the-bishomalo/shared-util';

@Injectable({ providedIn: 'root' })
export class BoardGeneratorService {
  private readonly gridGenerator = inject(GridGeneratorService);

  createBoard(settings: GameSettings): Cell[][] {
    return this.gridGenerator.createGrid<CellContent>(settings.size);
  }

  placeGold(board: Cell[][], settings: GameSettings): void {
    this.placeRandom(board, settings).content = CELL_CONTENTS.gold;
  }

  placeWumpus(board: Cell[][], settings: GameSettings): void {
    for (let i = 0; i < (settings.wumpus || 1); i++) {
      const type = `wumpus${settings.selectedChar}` as CellContentType;
      this.placeRandom(board, settings).content = CELL_CONTENTS[type];
    }
  }

  placePits(board: Cell[][], settings: GameSettings): void {
    for (let i = 0; i < settings.pits; i++) {
      this.placeRandom(board, settings, new Set(['0,0', '0,1', '1,0'])).content = CELL_CONTENTS.pit;
    }
  }

  placeArrows(board: Cell[][], settings: GameSettings): void {
    for (let i = 0; i < (settings.wumpus || 1) - 1; i++) {
      this.placeRandom(board, settings).content = CELL_CONTENTS.arrow;
    }
  }

  placeEvents(
    board: Cell[][],
    settings: GameSettings,
    currentLives: number,
  ): void {
    const { difficulty, size } = settings;
    const ex = new Set(['0,0']);
    const chance = (base: number, max: number) =>
      Math.min(base + ((size - 4) / (difficulty.maxLevels - 4)) * (max - base), max);

    if (
      Math.random() < chance(difficulty.baseChance, difficulty.maxChance) &&
      currentLives < difficulty.maxLives
    ) {
      this.placeRandom(board, settings, ex).content = CELL_CONTENTS.heart;
    }
  }

  private placeRandom(board: Cell[][], settings: GameSettings, excluded = new Set(['0,0'])): Cell {
    const size = settings.size;
    let cell: Cell;
    do {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      cell = board[x][y];
    } while (cell.content || excluded.has(`${cell.x},${cell.y}`));
    return cell;
  }

  calculatePits(size: number, luck: number): number {
    const penalty = 0.01 - luck / 1000;
    const totalCells = size * size;
    const basePercentage = 0.1 + penalty;
    return Math.max(1, Math.round(totalCells * basePercentage));
  }

  calculateWumpus(size: number, luck: number): number {
    const penalty = 0.01 - luck / 1000;
    const totalCells = size * size;
    const basePercentage = 0.04 + penalty;
    return Math.max(1, Math.round(totalCells * basePercentage));
  }
}
