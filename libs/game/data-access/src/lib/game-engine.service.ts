import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import {
  GAME_EVENT_SERVICE_TOKEN,
  GAME_SOUND_TOKEN,
  GAME_STORE_TOKEN,
} from '@hunt-the-bishomalo/core/api';
import {
  IGameEngineService,
  GAME_ACHIEVEMENT_TRACKER_TOKEN,
  GAME_STATS_TRACKER_TOKEN,
} from '@hunt-the-bishomalo/game/api';
import {
  Cell,
  CELL_CONTENTS,
  Direction,
  GameSound,
  RouteTypes,
  AchieveTypes,
} from '@hunt-the-bishomalo/shared-data';
import { take } from 'rxjs';
import { BoardGeneratorService } from './board-generator.service';
import { PerceptionService } from './perception.service';

@Injectable({ providedIn: 'root' })
export class GameEngineService implements IGameEngineService {
  private readonly store = inject(GAME_STORE_TOKEN);
  private readonly sound = inject(GAME_SOUND_TOKEN);
  private readonly achievementTracker = inject(GAME_ACHIEVEMENT_TRACKER_TOKEN);
  private readonly statsTracker = inject(GAME_STATS_TRACKER_TOKEN);
  private readonly router = inject(Router);
  private readonly gameEvents = inject(GAME_EVENT_SERVICE_TOKEN);
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
    const settings = this.store.settings();
    const board: Cell[][] = this.boardGenerator.createBoard(settings);
    this.boardGenerator.placeGold(board, settings);
    this.boardGenerator.placeWumpus(board, settings);
    this.boardGenerator.placePits(board, settings);
    this.boardGenerator.placeArrows(board, settings);
    this.boardGenerator.placeEvents(board, settings, this.store.lives(), this.store.dragonballs());
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
    this.statsTracker.resetSteps();
  }

  newGame(): void {
    this.sound.stop();
    this.store.resetStore();
    this.router.navigate([RouteTypes.SETTINGS]);
  }

  nextLevel(): void {
    const { size, difficulty } = this.store.settings();
    const newSize = size + 1;
    const newSettings = {
      ...this.store.settings(),
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
    const { isAlive, hasWon, hunter, settings } = this.store;
    const { x, y, direction } = hunter();
    if (!isAlive() || hasWon()) return;

    const size = settings().size;
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
        this.achievementTracker.activeAchievement(AchieveTypes.HARDHEAD);
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
      this.router.navigate([RouteTypes.JEDI, 'secret'], {
        state: { fromSecretPath: true },
      });
    }
  }

  turnLeft(): void {
    const dir = (this.store.hunter().direction + 3) % 4;
    this.store.updateHunter({ direction: dir });
  }

  turnRight(): void {
    const dir = (this.store.hunter().direction + 1) % 4;
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
    const { arrows } = this.store.hunter();
    if (!this.store.isAlive()) return false;
    if (!arrows) {
      this.store.setMessage(this.transloco.translate('gameMessages.noArrows'));
      return false;
    }
    return true;
  }

  private consumeArrow(): void {
    const { arrows } = this.store.hunter();
    this.store.updateHunter({ arrows: arrows - 1 });
    this.sound.playSound(GameSound.SHOOT, false);
  }

  private processArrowFlight(): { hitWumpus: boolean; cell: Cell } {
    const { direction } = this.store.hunter();
    let { x, y } = this.store.hunter();
    const board = this.store.board();
    const size = this.store.settings().size;
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
    const { luck } = this.store.settings().difficulty;
    const roll = Math.random() * 100;
    if (roll < 2) cell.content = CELL_CONTENTS.extrawumpus;
    else if (roll < 20 + luck) cell.content = CELL_CONTENTS.extraheart;
    else if (roll < 35 + luck) cell.content = CELL_CONTENTS.extragold;
    else if (roll < 40 + luck) cell.content = CELL_CONTENTS.extraarrow;
  }

  private handleMissedArrow(): void {
    this.store.setMessage(this.transloco.translate('gameMessages.arrowMissed'));
    if (!this.store.hunter().arrows) {
      this.achievementTracker.activeAchievement(AchieveTypes.MISSEDSHOT);
    }
  }

  calcVictoryAchieve(seconds: number): void {
    this.achievementTracker.calcVictoryAchieve(seconds);
  }

  handleWumpusKillAchieve(cell: Cell): void {
    this.achievementTracker.handleWumpusKillAchieve(cell);
  }

  exit(): void {
    this.sound.stop();
    this.handleVictory();
  }

  private canExitWithVictory(): boolean {
    const hunter = this.store.hunter();
    const cell = this.store.currentCell();
    return !!cell && !cell.x && !cell.y && hunter.hasGold;
  }

  private handleVictory(): void {
    let gold = 0;
    if (this.store.settings().blackout) gold = 200;
    this.store.setMessage(this.transloco.translate('gameMessages.victory'));
    this.store.updateGame({
      hasWon: true,
      hunter: { ...this.store.hunter(), gold: this.store.hunter().gold + gold },
    });
    this.playVictorySound();
  }

  private playVictorySound(): void {
    const settings = this.store.settings();
    if (settings.size === settings.difficulty.maxLevels + 3) {
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
    const { x, y } = this.store.hunter();
    const size = this.store.settings().size;
    const board = this.store.board();
    const adjacent: Cell[] = [];

    if (x > 0) adjacent.push(board[x - 1][y]);
    if (x < size - 1) adjacent.push(board[x + 1][y]);
    if (y > 0) adjacent.push(board[x][y - 1]);
    if (y < size - 1) adjacent.push(board[x][y + 1]);

    return adjacent;
  }

  private applyBlackoutChance(): boolean {
    return Math.random() < 0.08;
  }
}
