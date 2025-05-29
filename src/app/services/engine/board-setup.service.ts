import { inject, Injectable } from '@angular/core';
import { GameStore } from '../../store/game-store';
import { Cell, CELL_CONTENTS, CellContentType, Direction, GameSettings, Hunter } from '../../models';
import * as gameRulesUtils from '../../utils/game-rules.utils';

@Injectable({ providedIn: 'root' })
export class BoardSetupService {
  store = inject(GameStore);

  constructor() {}

  public initializeGameBoard(): void {
    const settings = this.store.settings();
    const hunter = this.store.hunter();
    const board: Cell[][] = Array.from({ length: settings.size }, (_, x) =>
      Array.from({ length: settings.size }, (_, y) => ({ x, y, visited: false })),
    );

    const ex = new Set(['0,0']);
    this.placeRandom(board, ex, settings).content = CELL_CONTENTS.gold;

    for (let i = 0; i < (settings.wumpus || 1); i++) {
      const type = `wumpus${settings.selectedChar}` as CellContentType;
      this.placeRandom(board, ex, settings).content = CELL_CONTENTS[type];
    }
    for (let i = 0; i < settings.pits; i++) {
      this.placeRandom(board, new Set(['0,0', '0,1', '1,0']), settings).content = CELL_CONTENTS.pit;
    }

    for (let i = 0; i < (settings.wumpus || 1) - 1; i++) {
      this.placeRandom(board, ex, settings).content = CELL_CONTENTS.arrow;
    }

    this.placeEvents(board, hunter, settings);
    this.store.updateBoard(board);
    this.setHunterForNextLevel();
  }

  private setHunterForNextLevel(): void {
    const hunter = this.store.hunter();
    const settings = this.store.settings();
    this.store.updateHunter({
      ...hunter,
      x: 0,
      y: 0,
      direction: Direction.RIGHT,
      arrows: settings.arrows,
      alive: true,
      hasGold: false,
      hasWon: false,
      wumpusKilled: 0,
      lives: Math.min(hunter.lives, settings.difficulty.maxLives),
    });
  }

  private placeRandom(board: Cell[][], excluded: Set<string>, settings: GameSettings): Cell {
    const size = settings.size;
    let cell: Cell;
    do {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      cell = board[x][y];
    } while (cell.content || excluded.has(`${cell.x},${cell.y}`));
    return cell;
  }

  private placeEvents(board: Cell[][], hunter: Hunter, settings: GameSettings): void {
    const { difficulty } = settings;
    const ex = new Set(['0,0']);
    const eventChance = gameRulesUtils.calculateEventChance(
      difficulty.baseChance,
      difficulty.maxChance,
      settings.size,
      difficulty.maxLevels
    );

    if (
      Math.random() < eventChance &&
      hunter.lives < difficulty.maxLives
    ) {
      this.placeRandom(board, ex, settings).content = CELL_CONTENTS.heart;
    }

    if (Math.random() < difficulty.baseChance && !hunter.dragonballs) {
      this.placeRandom(board, ex, settings).content = CELL_CONTENTS.dragonball;
    }
  }
}
