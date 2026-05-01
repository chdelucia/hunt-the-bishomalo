import { Injectable } from '@angular/core';
import { Cell, CELL_CONTENTS, CellContentType, GameSettings } from '@hunt-the-bishomalo/shared-data';

@Injectable({ providedIn: 'root' })
export class BoardGeneratorService {
  /**
   * Optimized coordinate lookups: using numeric keys (x * 100 + y) instead of strings
   * significantly reduces GC pressure and string interpolation overhead in loops.
   * Exclusion sets are hoisted to static constants to avoid redundant allocations.
   */
  private static readonly START_CELL_EXCLUSION = new Set([0]); // 0*100 + 0
  private static readonly PIT_EXCLUSION = new Set([0, 1, 100]); // (0,0), (0,1), (1,0) -> 0, 1, 100

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
    const wumpusCount = settings.wumpus || 1;
    for (let i = 0; i < wumpusCount; i++) {
      this.placeRandom(board, settings).content = CELL_CONTENTS[type];
    }
  }

  placePits(board: Cell[][], settings: GameSettings): void {
    for (let i = 0; i < settings.pits; i++) {
      this.placeRandom(board, settings, BoardGeneratorService.PIT_EXCLUSION).content =
        CELL_CONTENTS.pit;
    }
  }

  placeArrows(board: Cell[][], settings: GameSettings): void {
    const arrowCount = (settings.wumpus || 1) - 1;
    for (let i = 0; i < arrowCount; i++) {
      this.placeRandom(board, settings).content = CELL_CONTENTS.arrow;
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
      this.placeRandom(board, settings).content = CELL_CONTENTS.heart;
    }
    if (Math.random() < difficulty.baseChance && !dragonballs) {
      this.placeRandom(board, settings).content = CELL_CONTENTS.dragonball;
    }
  }

  private placeRandom(
    board: Cell[][],
    settings: GameSettings,
    excluded = BoardGeneratorService.START_CELL_EXCLUSION,
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
