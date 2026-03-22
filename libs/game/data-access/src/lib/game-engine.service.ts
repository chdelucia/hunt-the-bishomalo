import { DestroyRef, effect, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import {
  GAME_EVENT_SERVICE_TOKEN,
  GAME_SOUND_TOKEN,
  LOCALSTORAGE_SERVICE_TOKEN,
  GAME_STORE_TOKEN,
} from '@hunt-the-bishomalo/core/api';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { IGameEngineService } from '@hunt-the-bishomalo/game/api';
import { LEADERBOARD_SERVICE } from '@hunt-the-bishomalo/gamestats/api';
import {
  Cell,
  CELL_CONTENTS,
  Direction,
  GameSound,
  RouteTypes,
  AchieveTypes
} from '@hunt-the-bishomalo/data';
import { take } from 'rxjs';
import { BoardGeneratorService } from './board-generator.service';
import { PerceptionService } from './perception.service';

@Injectable({ providedIn: 'root' })
export class GameEngineService implements IGameEngineService {
  readonly store = inject(GAME_STORE_TOKEN);
  private readonly _settings = this.store.settings;
  private readonly _hunter = this.store.hunter;
  private readonly sound = inject(GAME_SOUND_TOKEN);
  private readonly leaderBoard = inject(LEADERBOARD_SERVICE);

  private countSteps = 0;
  private readonly achieve = inject(ACHIEVEMENT_SERVICE);
  private readonly router = inject(Router);
  private readonly localStorageService = inject(LOCALSTORAGE_SERVICE_TOKEN);
  private readonly gameEvents = inject(GAME_EVENT_SERVICE_TOKEN);
  private readonly transloco = inject(TranslocoService);
  private readonly boardGenerator = inject(BoardGeneratorService);
  private readonly perceptionService = inject(PerceptionService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => this.trackSteps());
    effect(() => this.handleGameOver());
  }

  private trackSteps(): void {
    const { x, y } = this._hunter();
    if (x || y) this.countSteps += 1;
  }

  private handleGameOver(): void {
    if (this.store.hasWon() || !this.store.isAlive()) {
      const { player, blackout, size } = this._settings();
      const endTime = new Date();
      const seconds = this.calculateElapsedSeconds(endTime);

      this.leaderBoard.addEntry({
        playerName: player,
        timeInSeconds: seconds,
        date: endTime,
        level: size - 4 + 1,
        blackout: !!blackout,
        wumpusKilled: this.store.wumpusKilled(),
        steps: this.countSteps,
        deads: this.store.isAlive() ? 0 : 1,
      });

      this.countSteps = 0;
      if (this.store.hasWon()) this.calcVictoryAchieve(seconds);
    }
  }

  private calculateElapsedSeconds(endTime: Date): number {
    const startime = new Date(this.store.startTime());
    return startime ? Math.round((endTime.getTime() - startime.getTime()) / 1000) : 0;
  }

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
    this.router.navigate([RouteTypes.SETTINGS]);
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

    while (this.isInBounds(x, y, size)) {
      const cell = board[x][y];
      lastCell = cell;
      if (cell.content?.type === 'wumpus') {
        return { hitWumpus: true, cell };
      }
      ({ x, y } = this.nextPosition(x, y, direction));
    }
    return { hitWumpus: false, cell: lastCell };
  }

  private isInBounds(x: number, y: number, size: number): boolean {
    return x >= 0 && y >= 0 && x < size && y < size;
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
    this.handleWumpusKillAchieve(cell);
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

  calcVictoryAchieve(seconds: number): void {
    const wumpusKilled = this.store.wumpusKilled();
    const { arrows } = this._hunter();
    const { blackout, size } = this._settings();

    if (blackout) this.achieve.activeAchievement(AchieveTypes.WINBLACKWOUT);
    if (arrows > 1 && !wumpusKilled) this.achieve.activeAchievement(AchieveTypes.WASTEDARROWS);
    else {
      if (size >= 12) this.achieve.activeAchievement(AchieveTypes.WINLARGEMAP);
      if (seconds <= 10) this.achieve.activeAchievement(AchieveTypes.SPEEDRUNNER);
      if (!wumpusKilled) this.achieve.activeAchievement(AchieveTypes.WRAT);
      if (wumpusKilled) this.achieve.activeAchievement(AchieveTypes.WINHERO);
      this.cartographyAchieve();
    }
    this.achieve.isAllCompleted();
  }

  handleWumpusKillAchieve(cell: Cell): void {
    const { blackout } = this._settings();
    const distance = this.calcDistance(cell);
    if (blackout) this.achieve.activeAchievement(AchieveTypes.BLINDWUMPUSKILLED);
    else if (distance > 3) this.achieve.activeAchievement(AchieveTypes.SNIPER);
    else if (distance === 1) this.achieve.activeAchievement(AchieveTypes.DEATHDUEL);
    else this.achieve.activeAchievement(AchieveTypes.WUMPUSKILLED);
  }

  private calcDistance(cell: Cell): number {
    const { x, y } = this._hunter();
    if (x === cell.x) return Math.abs(y - cell.y);
    if (y === cell.y) return Math.abs(x - cell.x);
    return 0;
  }

  private countVisitedCells(): number {
    const board = this.store.board();
    let count = 0;
    for (const row of board) {
      for (const cell of row) {
        if (cell.visited) count++;
      }
    }
    return count;
  }

  private cartographyAchieve(): void {
    const visited = this.countVisitedCells();
    const { size, pits } = this._settings();
    if (size * size - pits === visited) this.achieve.activeAchievement(AchieveTypes.EXPERTCARTO);
    if (visited > size * size * 0.5) this.achieve.activeAchievement(AchieveTypes.NOVICECARTO);
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
    const directions = [
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
    ];

    return directions
      .map(({ dx, dy }) => ({ x: x + dx, y: y + dy }))
      .filter(({ x, y }) => x >= 0 && y >= 0 && x < size && y < size)
      .map(({ x, y }) => board[x][y]);
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
