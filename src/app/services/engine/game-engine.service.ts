import { Injectable, Signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  GameStoreService,
  GameEventService,
  GameSoundService,
  LeaderboardService,
  AchievementService,
  LocalstorageService,
} from '../index';
import {
  AchieveTypes,
  Cell,
  CELL_CONTENTS,
  Direction,
  GameSettings,
  GameSound,
  Hunter,
  RouteTypes,
} from '../../models';

@Injectable({ providedIn: 'root' })
export class GameEngineService {
  private readonly storageSettingsKey = 'hunt_the_bishomalo_settings';
  private readonly _settings!: Signal<GameSettings>;
  private readonly _hunter!: Signal<Hunter>;

  constructor(
    private readonly store: GameStoreService,
    private readonly sound: GameSoundService,
    private readonly leaderBoard: LeaderboardService,
    private readonly achieve: AchievementService,
    private readonly router: Router,
    private readonly localStorageService: LocalstorageService,
    private readonly gameEvents: GameEventService,
  ) {
    this._settings = this.store.settings;
    this._hunter = this.store.hunter;
  }

  syncSettingsWithStorage(): void {
    const settings = this.localStorageService.getValue<GameSettings>(this.storageSettingsKey);
    if (settings) this.initGame(settings);
  }

  private updateLocalStorageWithSettings(config: GameSettings): void {
    this.localStorageService.setValue<GameSettings>(this.storageSettingsKey, config);
  }

  initGame(config?: GameSettings): void {
    this.sound.stop();
    if (config) {
      this.store.setSettings(config);
      this.updateLocalStorageWithSettings(config);
    }
    this.store.initBoard();
    this.checkCurrentCell(0, 0);
  }

  newGame(): void {
    this.sound.stop();
    this.localStorageService.clearValue(this.storageSettingsKey);
    this.store.resetHunter();
    this.store.resetSettings();
  }

  nextLevel(): void {
    const size = this._settings().size + 1;

    const newSettings = {
      ...this._settings(),
      size,
      pits: this.calculatePits(size),
      wumpus: this.calculateWumpus(size),
      blackout: this.applyBlackoutChance(),
    };

    this.initGame(newSettings);
  }

  moveForward(): void {
    this.sound.stop();
    const { x, y, direction, alive, hasWon } = this._hunter();
    if (!alive || hasWon) return;

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
      if (this.store.message() === '¡Choque contra un muro!') {
        this.achieve.activeAchievement(AchieveTypes.HARDHEAD);
      }
      this.store.setMessage('¡Choque contra un muro!');
      this.sound.playSound(GameSound.HITWALL, false);
      return;
    }

    this.store.updateHunter({ x: newX, y: newY });
    this.checkCurrentCell(x, y);
  }

  private checkSecret(size: number, x: number, y: number): void {
    if (size === 8 && x === 7 && y === 8) {
      this.router.navigate([RouteTypes.JEDI], {
        state: {
          fromSecretPath: true,
        },
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
    const { alive, arrows } = this._hunter();
    if (!alive) return false;

    if (!arrows) {
      this.store.setMessage('¡No tienes flechas!');
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

      if (cell.content === CELL_CONTENTS.wumpus) {
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
    this.store.setMessage('¡Has matado al Wumpus! ¡Grito!');
    this.sound.stopWumpus();
    this.sound.playSound(GameSound.PAIN, false);
    const wumpues = this._hunter()?.wumpusKilled;
    this.store.updateHunter({ wumpusKilled: wumpues + 1 });
    this.achieve.handleWumpusKillAchieve(cell);
    this.getDrop(cell);
  }

  private getDrop(cell: Cell): void {
    const roll = Math.random() * 100;

    if (roll < 2) cell.content = CELL_CONTENTS.extrawumpus;
    else if (roll < 18) cell.content = CELL_CONTENTS.extraheart;
    else if (roll < 28) cell.content = CELL_CONTENTS.extragold;
    else if (roll < 35) cell.content = CELL_CONTENTS.extraarrow;
  }

  private handleMissedArrow(): void {
    this.store.setMessage('¡Flecha fallida!');
    if (!this._hunter().arrows) this.achieve.activeAchievement(AchieveTypes.MISSEDSHOT);
  }

  exit(): void {
    if (this.canExitWithVictory()) {
      this.sound.stop();
      this.handleVictory();
    } else {
      this.store.setMessage('¡Para salir dirígete a la entrada con la moneda!');
    }
  }

  private canExitWithVictory(): boolean {
    const hunter = this._hunter();
    const cell = this.store.getCurrentCell();
    return (!cell.x && !cell.y && hunter.hasGold) || false;
  }

  private handleVictory(): void {
    const endTime = new Date();
    const seconds = this.calculateElapsedSeconds(endTime);
    const playerName = this._settings().player;

    this.store.setMessage(`¡Victoria!`);
    this.store.updateHunter({ hasWon: true });
    this.leaderBoard.addEntry({ playerName, timeInSeconds: seconds, date: endTime });
    this.playVictorySound();
    this.achieve.caclVictoryAchieve(seconds);
  }

  private calculateElapsedSeconds(endTime: Date): number {
    return this.store.startTime
      ? Math.round((endTime.getTime() - this.store.startTime.getTime()) / 1000)
      : 0;
  }

  private playVictorySound(): void {
    if (this._settings().size === 23) {
      this.sound.playSound(GameSound.FINISH, false);
    } else {
      this.sound.playSound(GameSound.WHONOR, false);
    }
  }

  private checkCurrentCell(x: number, y: number): void {
    const cell = this.store.getCurrentCell();
    cell.visited = true;

    if (this.canExitWithVictory()) {
      this.exit();
      return;
    }

    const contentType = cell.content?.type;

    if (contentType === 'pit' || contentType === 'wumpus') {
      const survived = this.playerHasRevive(contentType, cell, { x, y });
      if (survived) return;
    }

    if (cell.content) {
      this.gameEvents.applyEffectByCellContent(this._hunter(), cell);
      return;
    }

    this.sound.playSound(GameSound.WALK, false);
    this.store.setMessage(this.getPerceptionMessage());
  }

  private playerHasRevive(
    cause: 'pit' | 'wumpus',
    cell: Cell,
    prev: { x: number; y: number },
  ): boolean {
    const { hunter } = this.gameEvents.applyEffectsOnDeath(this._hunter(), cause, cell, prev);
    return hunter.alive;
  }

  private getPerceptionMessage(): string {
    const adjacentCells = this.getAdjacentCells();
    const perceptions: string[] = [];

    for (const cell of adjacentCells) {
      const perception = this.getPerceptionFromCell(cell);
      if (perception) perceptions.push(perception);
    }

    return perceptions.length > 0 ? perceptions.join(' ') : 'Nada sospechoso.';
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

  private getPerceptionFromCell(cell: Cell): string | null {
    if (cell.content === CELL_CONTENTS.wumpus) {
      this.sound.playSound(GameSound.WUMPUS);
      return 'Sientes hedor.';
    }

    if (cell.content === CELL_CONTENTS.pit) {
      this.sound.playSound(GameSound.WIND);
      return 'Sientes brisa.';
    }

    if (cell.content === CELL_CONTENTS.gold) {
      this.sound.playSound(GameSound.GOLD);
      return 'Sientes un brillo.';
    }

    return null;
  }

  private calculatePits(size: number): number {
    const totalCells = size * size;
    const basePercentage = 0.1;
    return Math.max(1, Math.floor(totalCells * basePercentage));
  }

  private calculateWumpus(size: number): number {
    const totalCells = size * size;
    const basePercentage = 0.04;
    return Math.max(1, Math.floor(totalCells * basePercentage));
  }

  private applyBlackoutChance(): boolean {
    const blackoutChance = 0.08;
    return Math.random() < blackoutChance;
  }
}
