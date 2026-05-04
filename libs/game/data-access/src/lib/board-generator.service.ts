import { Injectable } from '@angular/core';
import { Cell, CELL_CONTENTS, CellContentType, GameSettings } from '@hunt-the-bishomalo/shared-data';

@Injectable({ providedIn: 'root' })
export class BoardGeneratorService {
  private static readonly INITIAL_EXCLUDED = new Set<number>([0]); // 0*100 + 0
  private static readonly PIT_EXCLUDED = new Set<number>([0, 1, 100]); // (0,0), (0,1), (1,0)

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
    const iterations = settings.wumpus || 1;
    for (let i = 0; i < iterations; i++) {
      this.placeRandom(board, settings).content = content;
    }
  }

  placePits(board: Cell[][], settings: GameSettings): void {
    const content = CELL_CONTENTS.pit;
    for (let i = 0; i < settings.pits; i++) {
      this.placeRandom(board, settings, BoardGeneratorService.PIT_EXCLUDED).content = content;
    }
  }

  placeArrows(board: Cell[][], settings: GameSettings): void {
    const content = CELL_CONTENTS.arrow;
    const iterations = (settings.wumpus || 1) - 1;
    for (let i = 0; i < iterations; i++) {
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
    const chance = (base: number, max: number) =>
      Math.min(base + ((size - 4) / (difficulty.maxLevels - 4)) * (max - base), max);

    if (
      Math.random() < chance(difficulty.baseChance, difficulty.maxChance) &&
      currentLives < difficulty.maxLives
    ) {
      this.placeRandom(board, settings, BoardGeneratorService.INITIAL_EXCLUDED).content =
        CELL_CONTENTS.heart;
    }
    if (Math.random() < difficulty.baseChance && !dragonballs) {
      this.placeRandom(board, settings, BoardGeneratorService.INITIAL_EXCLUDED).content =
        CELL_CONTENTS.dragonball;
    }
  }

  private placeRandom(
    board: Cell[][],
    settings: GameSettings,
    excluded: Set<number> = BoardGeneratorService.INITIAL_EXCLUDED,
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
