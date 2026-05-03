import { Injectable } from '@angular/core';
import { Cell, CELL_CONTENTS, CellContentType, GameSettings } from '@hunt-the-bishomalo/shared-data';

@Injectable({ providedIn: 'root' })
export class BoardGeneratorService {
  /**
   * Optimized coordinate lookups using numeric keys to reduce string interpolation overhead and GC pressure.
   * Format: x * 100 + y
   */
  private static readonly INITIAL_CELL_KEY = 0; // 0 * 100 + 0
  private static readonly EXCLUDED_PIT_KEYS = new Set([0, 1, 100]); // (0,0), (0,1), (1,0)

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
    const wumpusCount = settings.wumpus || 1;

    for (let i = 0; i < wumpusCount; i++) {
      this.placeRandom(board, settings).content = content;
    }
  }

  placePits(board: Cell[][], settings: GameSettings): void {
    const content = CELL_CONTENTS.pit;
    for (let i = 0; i < settings.pits; i++) {
      this.placeRandom(board, settings, BoardGeneratorService.EXCLUDED_PIT_KEYS).content = content;
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
    dragonballs: number | undefined,
  ): void {
    const { difficulty, size } = settings;
    const ex = new Set([BoardGeneratorService.INITIAL_CELL_KEY]);
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

  private placeRandom(board: Cell[][], settings: GameSettings, excluded = new Set([0])): Cell {
    const size = settings.size;
    let cell: Cell;
    let x: number;
    let y: number;
    do {
      x = Math.floor(Math.random() * size);
      y = Math.floor(Math.random() * size);
      cell = board[x][y];
    } while (cell.content || excluded.has(x * 100 + y));
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
