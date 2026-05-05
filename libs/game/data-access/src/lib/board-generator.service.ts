import { Injectable } from '@angular/core';
import { Cell, CELL_CONTENTS, CellContentType, GameSettings } from '@hunt-the-bishomalo/shared-data';

@Injectable({ providedIn: 'root' })
export class BoardGeneratorService {
  private static readonly DEFAULT_EXCLUDED = new Set([0]); // 0,0
  private static readonly PITS_EXCLUDED = new Set([0, 1, 100]); // 0,0; 0,1; 1,0

  createBoard(settings: GameSettings): Cell[][] {
    return Array.from({ length: settings.size }, (_, x) =>
      Array.from({ length: settings.size }, (_, y) => ({ x, y, visited: false })),
    );
  }

  placeGold(board: Cell[][], settings: GameSettings): void {
    const goldContent = CELL_CONTENTS.gold;
    this.placeRandom(board, settings.size, BoardGeneratorService.DEFAULT_EXCLUDED).content = goldContent;
  }

  placeWumpus(board: Cell[][], settings: GameSettings): void {
    const type = `wumpus${settings.selectedChar}` as CellContentType;
    const wumpusContent = CELL_CONTENTS[type];
    const iterations = settings.wumpus || 1;
    for (let i = 0; i < iterations; i++) {
      this.placeRandom(board, settings.size, BoardGeneratorService.DEFAULT_EXCLUDED).content = wumpusContent;
    }
  }

  placePits(board: Cell[][], settings: GameSettings): void {
    const pitContent = CELL_CONTENTS.pit;
    for (let i = 0; i < settings.pits; i++) {
      this.placeRandom(board, settings.size, BoardGeneratorService.PITS_EXCLUDED).content = pitContent;
    }
  }

  placeArrows(board: Cell[][], settings: GameSettings): void {
    const arrowContent = CELL_CONTENTS.arrow;
    const iterations = (settings.wumpus || 1) - 1;
    for (let i = 0; i < iterations; i++) {
      this.placeRandom(board, settings.size, BoardGeneratorService.DEFAULT_EXCLUDED).content = arrowContent;
    }
  }

  placeEvents(
    board: Cell[][],
    settings: GameSettings,
    currentLives: number,
    dragonballs: number | undefined,
  ): void {
    const { difficulty, size } = settings;
    const chance = (base: number, max: number) =>
      Math.min(base + ((size - 4) / (difficulty.maxLevels - 4)) * (max - base), max);

    if (
      Math.random() < chance(difficulty.baseChance, difficulty.maxChance) &&
      currentLives < difficulty.maxLives
    ) {
      const heartContent = CELL_CONTENTS.heart;
      this.placeRandom(board, size, BoardGeneratorService.DEFAULT_EXCLUDED).content = heartContent;
    }
    if (Math.random() < difficulty.baseChance && !dragonballs) {
      const dragonballContent = CELL_CONTENTS.dragonball;
      this.placeRandom(board, size, BoardGeneratorService.DEFAULT_EXCLUDED).content = dragonballContent;
    }
  }

  private placeRandom(board: Cell[][], size: number, excluded: Set<number>): Cell {
    let cell: Cell;
    do {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      cell = board[x][y];
    } while (cell.content || excluded.has(cell.x * 100 + cell.y));
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
