import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import {
  GameEventService,
  GameSoundService,
  LocalstorageService,
  ACHIEVEMENT_SERVICE,
  LEADERBOARD_SERVICE,
  IGameEngineService
} from '@hunt-the-bishomalo/core/services';
import {
  Cell,
  CELL_CONTENTS,
  Direction,
  GameSound,
  RouteTypes,
  AchieveTypes
} from '@hunt-the-bishomalo/data';
import { isInBounds, getAdjacentPositions } from '@hunt-the-bishomalo/shared-util';
import { GameStore } from '@hunt-the-bishomalo/core/store';
import { take } from 'rxjs';
import { BoardGeneratorService } from './board-generator.service';
import { PerceptionService } from './perception.service';

@Injectable({ providedIn: 'root' })
export class GameEngineService implements IGameEngineService {
  readonly store = inject(GameStore);
  private readonly _settings = this.store.settings;
  private readonly _hunter = this.store.hunter;
  private readonly sound = inject(GameSoundService);
  private readonly leaderBoard = inject(LEADERBOARD_SERVICE);
  private readonly achieve = inject(ACHIEVEMENT_SERVICE);
  private readonly router = inject(Router);
  private readonly localStorageService = inject(LocalstorageService);
  private readonly gameEvents = inject(GameEventService);
  private readonly transloco = inject(TranslocoService);
  private readonly boardGenerator = inject(BoardGeneratorService);
  private readonly perceptionService = inject(PerceptionService);
  private readonly destroyRef = inject(DestroyRef);

  initGame(): void {
    this.sound.stop();
    this.initializeGameBoard();
    this.checkCurrentCell(0, 0);
  }

  public initializeGameBoard(): void {
    const settings = this._settings();
    const board: Cell[][] = this.boardGenerator.createBoard(settings);
    this.boardGenerator.placeGold(board, settings);
    this.boardGenerator.placeWumpus(board, settings);
    this.boardGenerator.placePits(board, settings);
    this.boardGenerator.placeArrows(board, settings);
    this.boardGenerator.placeEvents(
      board,
      settings,
      this.store.lives(),
      this.store.dragonballs(),
    );
    this.store.updateGame({ board });
    this.setHunterForNextLevel();
  }

  private setHunterForNextLevel(): void {
    this.store.updateHunter({
      x: 0,
      y: 0,
      direction: Direction.RIGHT,
      arrows: 1,
      hasGold: false,
    });
    this.store.updateGame({ wumpusKilled: 0, isAlive: true, hasWon: false });
  }

  newGame(): void {
    this.sound.stop();
    this.store.resetStore();
    this.leaderBoard.clear();
  }

  nextLevel(): void {
    const { size, difficulty } = this._settings();
    const newSize = size + 1;
    const newSettings = {
      ...this._settings(),
      size: newSize,
      pits: this.boardGenerator.calculatePits(size, difficulty.luck),
      wumpus: this.boardGenerator.calculateWumpus(size, difficulty.luck),
      blackout: this.applyBlackoutChance(),
    };
    this.store.updateGame({ settings: newSettings });
    this.initializeGameBoard();
    this.checkCurrentCell(0, 0);
  }

  moveForward(): void {
    this.sound.stop();
    const { isAlive, hasWon } = this.store;
    const { x, y, direction } = this._hunter();
    if (!isAlive() || hasWon()) return;

    const size = this._settings().size;
    let newX = x,
      newY = y;

    switch (direction) {
      case Direction.UP:
        newX--;
        break;
      case Direction.DOWN:
        newX++;
        break;
      case Direction.LEFT:
        newY--;
        break;
      case Direction.RIGHT:
        newY++;
        break;
    }

    this.checkSecret(size, newX, newY);

    if (newX < 0 || newY < 0 || newX >= size || newY >= size) {
      const wallCollisionMessage = this.transloco.translate('gameMessages.wallCollision');
      if (this.store.message() === wallCollisionMessage) {
        this.achieve.activeAchievement(AchieveTypes.HARDHEAD);
      }
      this.store.setMessage(wallCollisionMessage);
      this.sound.playSound(GameSound.HITWALL, false);
      return;
    }

    this.store.updateHunter({ x: newX, y: newY });
    this.checkCurrentCell(x, y);
  }

  private checkSecret(size: number, x: number, y: number): void {
    if (size === 8 && x === 7 && y === 8) {
      this.router.navigate([RouteTypes.JEDI], {
        state: { fromSecretPath: true },
      });
    }
  }

  turnLeft(): void {
    const dir = (this._hunter().direction + 3) % 4;
    this.store.updateHunter({ direction: dir });
  }

  turnRight(): void {
    const dir = (this._hunter().direction + 1) % 4;
    this.store.updateHunter({ direction: dir });
  }

  shootArrow(): void {
    if (!this.canShoot()) return;
    this.consumeArrow();
    const result = this.processArrowFlight();
    if (result.hitWumpus) {
      this.handleWumpusHit(result.cell);
    } else {
      this.handleMissedArrow();
    }
  }

  private canShoot(): boolean {
    const { arrows } = this._hunter();
    if (!this.store.isAlive()) return false;
    if (!arrows) {
      this.store.setMessage(this.transloco.translate('gameMessages.noArrows'));
      return false;
    }
    return true;
  }

  private consumeArrow(): void {
    const { arrows } = this._hunter();
    this.store.updateHunter({ arrows: arrows - 1 });
    this.sound.playSound(GameSound.SHOOT, false);
  }

  private processArrowFlight(): { hitWumpus: boolean; cell: Cell } {
    const { direction } = this._hunter();
    let { x, y } = this._hunter();
    const board = this.store.board();
    const size = this._settings().size;
    let lastCell: Cell = board[x][y];

    while (isInBounds(x, y, size)) {
      const cell = board[x][y];
      lastCell = cell;
      if (cell.content?.type === 'wumpus') {
        return { hitWumpus: true, cell };
      }
      ({ x, y } = this.nextPosition(x, y, direction));
    }
    return { hitWumpus: false, cell: lastCell };
  }

  private nextPosition(x: number, y: number, dir: Direction): { x: number; y: number } {
    switch (dir) {
      case Direction.UP:
        return { x: x - 1, y };
      case Direction.DOWN:
        return { x: x + 1, y };
      case Direction.LEFT:
        return { x, y: y - 1 };
      case Direction.RIGHT:
        return { x, y: y + 1 };
    }
  }

  private handleWumpusHit(cell: Cell): void {
    cell.content = undefined;
    this.store.setMessage(this.transloco.translate('gameMessages.wumpusKilled'));
    this.sound.stopWumpus();
    this.sound.playSound(GameSound.PAIN, false);
    this.store.countWumpusKilled();
    this.achieve.handleWumpusKillAchieve(cell);
    this.getDrop(cell);
  }

  private getDrop(cell: Cell): void {
    const { luck } = this._settings().difficulty;
    /**
     * Security Hotspot Justification:
     * Math.random() is used here for game mechanics (random item drop calculation).
     * It does not involve any security-sensitive operations.
     */
    const roll = Math.random() * 100;
    if (roll < 2) cell.content = CELL_CONTENTS.extrawumpus;
    else if (roll < 20 + luck) cell.content = CELL_CONTENTS.extraheart;
    else if (roll < 35 + luck) cell.content = CELL_CONTENTS.extragold;
    else if (roll < 40 + luck) cell.content = CELL_CONTENTS.extraarrow;
  }

  private handleMissedArrow(): void {
    this.store.setMessage(this.transloco.translate('gameMessages.arrowMissed'));
    if (!this._hunter().arrows) this.achieve.activeAchievement(AchieveTypes.MISSEDSHOT);
  }

  exit(): void {
    this.sound.stop();
    this.handleVictory();
  }

  private canExitWithVictory(): boolean {
    const hunter = this._hunter();
    const cell = this.store.currentCell();
    return !!cell && !cell.x && !cell.y && hunter.hasGold;
  }

  private handleVictory(): void {
    let gold = 0;
    if (this._settings().blackout) gold = 200;
    this.store.setMessage(this.transloco.translate('gameMessages.victory'));
    this.store.updateGame({
      hasWon: true,
      hunter: { ...this._hunter(), gold: this._hunter().gold + gold },
    });
    this.playVictorySound();
  }

  private playVictorySound(): void {
    if (this._settings().size === this._settings().difficulty.maxLevels + 3) {
      this.sound.playSound(GameSound.FINISH, false);
    } else {
      this.sound.playSound(GameSound.WHONOR, false);
    }
  }

  private checkCurrentCell(x: number, y: number): void {
    const cell = this.store.currentCell();
    if (!cell) return;
    cell.visited = true;

    if (this.canExitWithVictory()) {
      this.exit();
      return;
    }

    const contentType = cell.content?.type;

    if (contentType === 'pit' || contentType === 'wumpus') {
      const survived = this.gameEvents.applyEffectsOnDeath(contentType, cell, { x, y });
      if (survived) return;
    }

    if (cell.content) {
      this.gameEvents.applyEffectByCellContent(cell);
      return;
    }

    this.sound.playSound(GameSound.WALK, false);
    this.perceptionService
      .getPerceptionMessage(this.getAdjacentCells())
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((msg) => this.store.setMessage(msg));
  }

  private getAdjacentCells(): Cell[] {
    const { x, y } = this._hunter();
    const size = this._settings().size;
    const board = this.store.board();

    return getAdjacentPositions(x, y, size).map(({ x, y }) => board[x][y]);
  }

  private applyBlackoutChance(): boolean {
    /**
     * Security Hotspot Justification:
     * Math.random() is used here for game mechanics (random blackout chance).
     * It does not involve any security-sensitive operations.
     */
    return Math.random() < 0.08;
  }
}
