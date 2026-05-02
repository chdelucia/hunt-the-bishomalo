import { Injectable } from '@angular/core';
import { Cell, CELL_CONTENTS, CellContentType, GameSettings } from '@hunt-the-bishomalo/shared-data';

@Injectable({ providedIn: 'root' })
export class BoardGeneratorService {
  /**
   * Optimized coordinate exclusion sets. Numeric keys (x * 100 + y) are used instead
   * of string keys to avoid template literals and reduce GC pressure during generation.
   * Hoisting these to static constants avoids redundant allocations.
   */
  private static readonly START_CELL_EXCLUSION = new Set([0]);
  private static readonly PIT_EXCLUSION = new Set([0, 1, 100]); // (0,0), (0,1), (1,0)

  createBoard(settings: GameSettings): Cell[][] {
    return Array.from({ length: settings.size }, (_, x) =>
      Array.from({ length: settings.size }, (_, y) => ({ x, y, visited: false })),
    );
  }

  placeGold(board: Cell[][], settings: GameSettings): void {
    this.placeRandom(board, settings).content = CELL_CONTENTS.gold;
  }

  placeWumpus(board: Cell[][], settings: GameSettings): void {
    const type = `wumpus${settings.selectedChar}` as CellContentType;
    const content = CELL_CONTENTS[type];
    for (let i = 0; i < (settings.wumpus || 1); i++) {
      this.placeRandom(board, settings).content = content;
    }
  }

  placePits(board: Cell[][], settings: GameSettings): void {
    const content = CELL_CONTENTS.pit;
    for (let i = 0; i < settings.pits; i++) {
      this.placeRandom(board, settings, BoardGeneratorService.PIT_EXCLUSION).content = content;
    }
  }

  placeArrows(board: Cell[][], settings: GameSettings): void {
    const content = CELL_CONTENTS.arrow;
    for (let i = 0; i < (settings.wumpus || 1) - 1; i++) {
      this.placeRandom(board, settings).content = content;
    }
  }

  placeEvents(
    board: Cell[][],
    settings: GameSettings,
    currentLives: number,
    dragonballs: number | undefined,
  ): void {
    const { difficulty, size } = settings;
    const ex = BoardGeneratorService.START_CELL_EXCLUSION;
    const chance = (base: number, max: number) =>
      Math.min(base + ((size - 4) / (difficulty.maxLevels - 4)) * (max - base), max);

    if (
      Math.random() < chance(difficulty.baseChance, difficulty.maxChance) &&
      currentLives < difficulty.maxLives
    ) {
      this.placeRandom(board, settings, ex).content = CELL_CONTENTS.heart;
    }
    if (Math.random() < difficulty.baseChance && !dragonballs) {
      this.placeRandom(board, settings, ex).content = CELL_CONTENTS.dragonball;
    }
  }

  /**
   * Finds a random empty cell that is not in the exclusion list.
   * Optimization: Uses numeric keys (x * 100 + y) for O(1) Set lookups
   * without string interpolation overhead.
   */
  private placeRandom(
    board: Cell[][],
    settings: GameSettings,
    excluded: Set<number> = BoardGeneratorService.START_CELL_EXCLUSION,
  ): Cell {
    const size = settings.size;
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
