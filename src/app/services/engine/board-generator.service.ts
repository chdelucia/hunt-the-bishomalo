import { inject, Injectable } from '@angular/core';
import { GameStore } from '../../store/game-store';
import {
  Cell,
  CELL_CONTENTS,
  CellContentType,
  GameSettings,
} from '../../models';

@Injectable({ providedIn: 'root' })
export class BoardGeneratorService {
  private readonly store = inject(GameStore);

  public createBoard(settings: GameSettings): Cell[][] {
    return Array.from({ length: settings.size }, (_, x) =>
      Array.from({ length: settings.size }, (_, y) => ({ x, y, visited: false })),
    );
  }

  public placeGold(board: Cell[][]): void {
    this.placeRandom(board).content = CELL_CONTENTS.gold;
  }

  public placeWumpus(board: Cell[][], settings: GameSettings): void {
    for (let i = 0; i < (settings.wumpus || 1); i++) {
      const type = `wumpus${settings.selectedChar}` as CellContentType;
      this.placeRandom(board).content = CELL_CONTENTS[type];
    }
  }

  public placePits(board: Cell[][], settings: GameSettings): void {
    for (let i = 0; i < settings.pits; i++) {
      this.placeRandom(board, new Set(['0,0', '0,1', '1,0'])).content = CELL_CONTENTS.pit;
    }
  }

  public placeArrows(board: Cell[][], settings: GameSettings): void {
    for (let i = 0; i < (settings.wumpus || 1) - 1; i++) {
      this.placeRandom(board).content = CELL_CONTENTS.arrow;
    }
  }

  public placeRandom(board: Cell[][], excluded = new Set(['0,0'])): Cell {
    const size = this.store.settings().size;
    let cell: Cell;
    do {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      cell = board[x][y];
    } while (cell.content || excluded.has(`${cell.x},${cell.y}`));
    return cell;
  }

  public placeEvents(board: Cell[][]): void {
    const { difficulty, size } = this.store.settings();
    const ex = new Set(['0,0']);
    const chance = (base: number, max: number) =>
      Math.min(base + ((size - 4) / (difficulty.maxLevels - 4)) * (max - base), max);

    if (
      Math.random() < chance(difficulty.baseChance, difficulty.maxChance) &&
      this.store.lives() < difficulty.maxLives
    ) {
      this.placeRandom(board, ex).content = CELL_CONTENTS.heart;
    }

    if (Math.random() < difficulty.baseChance && !this.store.dragonballs()) {
      this.placeRandom(board, ex).content = CELL_CONTENTS.dragonball;
    }
  }

  public calculatePits(size: number, luck: number): number {
    const penalty = 0.01 - luck / 1000;
    const totalCells = size * size;
    const basePercentage = 0.1 + penalty;
    return Math.max(1, Math.round(totalCells * basePercentage));
  }

  public calculateWumpus(size: number, luck: number): number {
    const penalty = 0.01 - luck / 1000;
    const totalCells = size * size;
    const basePercentage = 0.04 + penalty;
    return Math.max(1, Math.round(totalCells * basePercentage));
  }

  public applyBlackoutChance(): boolean {
    const blackoutChance = 0.08;
    return Math.random() < blackoutChance;
  }
}
