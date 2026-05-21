import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import {
  GAME_SOUND_TOKEN,
  GAME_STORE_TOKEN,
} from '@hunt-the-bishomalo/core/api';
import {
  IGameEngineService,
  GAME_ACHIEVEMENT_TRACKER_TOKEN,
  GAME_STATS_TRACKER_TOKEN,
  GAME_RULES_TOKEN,
} from '@hunt-the-bishomalo/game/api';
import {
  Cell,
  Direction,
  GameSound,
  RouteTypes,
  AchieveTypes,
} from '@hunt-the-bishomalo/shared-data';
import { take } from 'rxjs';
import { BoardGeneratorService } from './board-generator.service';

@Injectable({ providedIn: 'root' })
export class GameEngineService implements IGameEngineService {
  private readonly store = inject(GAME_STORE_TOKEN);
  private readonly sound = inject(GAME_SOUND_TOKEN);
  private readonly achievementTracker = inject(GAME_ACHIEVEMENT_TRACKER_TOKEN);
  private readonly statsTracker = inject(GAME_STATS_TRACKER_TOKEN);
  private readonly router = inject(Router);
  private readonly transloco = inject(TranslocoService);
  private readonly boardGenerator = inject(BoardGeneratorService);
  private readonly rules = inject(GAME_RULES_TOKEN);
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
    this.boardGenerator.placeEvents(board, settings, this.store.lives());

    this.store.updateGame({
      board,
      ...this.rules.getInitialGameState(),
      hunter: {
        ...this.store.hunter(),
        ...this.rules.getInitialHunterState(),
      }
    });
    this.statsTracker.resetSteps();
  }

  newGame(): void {
    this.sound.stop();
    this.store.resetStore();
    this.router.navigate([RouteTypes.SETTINGS]);
  }

  nextLevel(): void {
    const newSettings = this.rules.getNextLevelSettings(this.store.settings());
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

  performAction(): void {
    this.rules.executeAction();
  }

  shootArrow(): void {
    this.performAction();
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

    if (this.rules.canExitWithVictory(cell, this.store.hunter())) {
      this.exit();
      return;
    }

    this.rules.onCellEntry(cell, { x, y });

    if (this.store.isAlive() && !this.store.hasWon()) {
      const msg = this.rules.getPerception(this.getAdjacentCells());
      this.store.setMessage(msg);
    }
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
}
