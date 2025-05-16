import { Injectable } from '@angular/core';
import { AchieveTypes, Cell, Direction, GameSettings, GameSound } from '../../models';
import { GameStoreService } from '../store/game-store.service';
import { GameSoundService } from '../sound/game-sound.service';
import { LeaderboardService } from '../score/leaderboard.service';
import { AchievementService } from '../achievement/achievement.service';
import { Router } from '@angular/router';
import { LocalstorageService } from '../localstorage/localstorage.service';

@Injectable({ providedIn: 'root' })
export class GameEngineService {
  private readonly storageSettingsKey = 'hunt_the_bishomalo_settings';

  constructor(
    private readonly store: GameStoreService, 
    private readonly sound: GameSoundService,
    private readonly leaderBoard: LeaderboardService,
    private readonly achieve: AchievementService,
    private readonly router: Router,
    private readonly localStorageService: LocalstorageService
  ) {}

  syncSettingsWithStorage(): void {
    const settings = this.localStorageService.getValue<GameSettings>(this.storageSettingsKey);
    if(settings) this.initGame(settings); 
  }

  private updateLocalStorageWithSettings(config: GameSettings): void {
    this.localStorageService.setValue<GameSettings>(this.storageSettingsKey, config);
  }

  initGame(config?: GameSettings): void {
    this.sound.stop();
    if(config) {
      this.store.setSettings(config);
      this.updateLocalStorageWithSettings(config);
  }
    this.store.initBoard();
    this.checkCurrentCell();
  }

  newGame():void{
    this.sound.stop();
    this.store.resetSettings();
  }

  moveForward(): void {
    this.sound.stop();
    const { x, y, direction, alive, hasWon } = this.store.hunter();
    if (!alive || hasWon) return;

    const size = this.store.settings.size;
    let newX = x, newY = y;

    switch (direction) {
      case Direction.UP: newX--; break;
      case Direction.DOWN: newX++; break;
      case Direction.LEFT: newY--; break;
      case Direction.RIGHT: newY++; break;
    }

    this.checkSecret(size, newX, newY);
 
    if (newX < 0 || newY < 0 || newX >= size || newY >= size) {
      if(this.store.message() === '¡Choque contra un muro!'){
        this.achieve.activeAchievement(AchieveTypes.HARDHEAD);
      }
      //this.store.setMessage(this.getPerceptionMessage() + ' ¡Choque contra un muro!');
      // Para hacer el juego mas dificil, lo mismo para pick el gold y la arrow
      this.store.setMessage('¡Choque contra un muro!');
      this.sound.playSound(GameSound.HITWALL, false);
      return;
    }

    this.store.updateHunter({ x: newX, y: newY });
    this.checkCurrentCell();
  }

  private checkSecret(size:number, x:number, y: number): void {
   if(size===8 && x === 7 && y === 8){
      this.router.navigateByUrl('/secret');
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
      this.handleMissedArrow(result.cell);
    }
  }


  private canShoot(): boolean {
    const { alive, arrows } = this.store.hunter();
    if (!alive) return false;

    if (!arrows) {
      this.store.setMessage('¡No tienes flechas!');
      return false;
    }

    return true;
  }

  private addArrow(): void {
    const { arrows } = this.store.hunter();
    this.store.updateHunter({ arrows: arrows + 1 });
  }

  private consumeArrow(): void {
    const { arrows } = this.store.hunter();
    this.store.updateHunter({ arrows: arrows - 1 });
    this.sound.playSound(GameSound.SHOOT, false)
  }

  private processArrowFlight(): { hitWumpus: boolean; cell: Cell } {
    const direction = this.store.hunter().direction;
    let { x, y } = this.store.hunter();
    const board = this.store.board();
    const size = this.store.settings.size;

    let lastCell: Cell = board[x][y];

    while (this.isInBounds(x, y, size)) {
      const cell = board[x][y];
      lastCell = cell;

      if (cell.hasWumpus) {
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
      case Direction.UP: return { x: x - 1, y };
      case Direction.DOWN: return { x: x + 1, y };
      case Direction.LEFT: return { x, y: y - 1 };
      case Direction.RIGHT: return { x, y: y + 1 };
    }
  }

  private handleWumpusHit(cell: Cell): void {
    cell.hasWumpus = false;
    this.store.setMessage('¡Has matado al Wumpus! ¡Grito!');
    this.sound.stopWumpus();
    this.sound.playSound(GameSound.PAIN, false);
    this.store.updateBoard([...this.store.board()]);
    this.store.updateHunter({ wumpusKilled: true });
    this.achieve.handleWumpusKillAchieve(cell);
  }

  private handleMissedArrow(cell: Cell): void {
    if (!cell.hasPit && !cell.hasGold && !cell.hasWumpus) {
      cell.hasArrow = true;
    }
    this.store.setMessage('¡Flecha fallida!');
    if(!this.store.hunter().arrows) this.achieve.activeAchievement(AchieveTypes.MISSEDSHOT);
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
    const hunter = this.store.hunter();
    const cell = this.store.getCurrentCell();
    return (cell.isStart && hunter.hasGold) || false;
  }

  private handleVictory(): void {
    const endTime = new Date();
    const seconds = this.calculateElapsedSeconds(endTime);
    const playerName = this.store.settings.player;

    this.store.setMessage(`¡Escapaste en ${seconds} segundos! ¡Victoria!`);
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
    const sound = this.store.hunter().wumpusKilled ? GameSound.WHONOR : GameSound.WRAT;
    this.sound.playSound(sound, false);
  }

  private checkCurrentCell(): void {
    const cell = this.store.getCurrentCell();
    const { x, y } = cell;

    this.store.markCellVisited(x, y);

    if (this.canExitWithVictory()){ this.exit(); return; }
    if (this.handleDeadlyCell(cell)) return;
    if (this.handleGold(cell)) return;
    if (this.handleArrow(cell)) return;

    this.sound.playSound(GameSound.WALK, false);
    this.store.setMessage(this.getPerceptionMessage());
  }

  private handleDeadlyCell(cell: Cell): boolean {
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }

    if (cell.hasPit) {
      this.killHunter('¡Caíste en un pozo!');
      if(this.store.settings.blackout) this.achieve.activeAchievement(AchieveTypes.DEATHBYBLACKOUT);
      else if(this.store.hunter().wumpusKilled) this.achieve.activeAchievement(AchieveTypes.LASTBREATH);
      else this.achieve.activeAchievement(AchieveTypes.DEATHBYPIT);
      return true;
    }

    if (cell.hasWumpus) {
      this.killHunter('¡El Wumpus te devoró!');
      if(this.store.settings.blackout) this.achieve.activeAchievement(AchieveTypes.DEATHBYBLACKOUT);
      else this.achieve.activeAchievement(AchieveTypes.DEATHBYWUMPUES);
      return true;
    }

    return false;
  }

  private killHunter(message: string): void {
    this.store.updateHunter({ alive: false });
    this.store.setMessage(message);
    this.sound.playSound(GameSound.SCREAM, false);
  }

  private handleGold(cell: Cell): boolean {
    if (!cell.hasGold) return false;

    this.store.updateHunter({ hasGold: true });
    cell.hasGold = false;
    this.store.setMessage('Has recogido el oro.');
    this.sound.playSound(GameSound.PICKUP, false);
    this.achieve.activeAchievement(AchieveTypes.PICKGOLD);
    return true;
  }

  private handleArrow(cell: Cell): boolean {
    if (!cell.hasArrow) return false;

    cell.hasArrow = false;
    this.addArrow();
    this.store.setMessage('Has recogido una flecha.');
    this.sound.playSound(GameSound.PICKUP, false);
    this.achieve.activeAchievement(AchieveTypes.PICKARROW);
    return true;
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
    const { x, y } = this.store.hunter();
    const size = this.store.settings.size;
    const board = this.store.board();

    const directions = [
      { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
      { dx: 0, dy: -1 }, { dx: 0, dy: 1 }
    ];

    return directions
      .map(({ dx, dy }) => ({ x: x + dx, y: y + dy }))
      .filter(({ x, y }) => x >= 0 && y >= 0 && x < size && y < size)
      .map(({ x, y }) => board[x][y]);
  }

  private getPerceptionFromCell(cell: Cell): string | null {
    if (cell.hasWumpus) {
      this.sound.playSound(GameSound.WUMPUS);
      return 'Sientes hedor.';
    }

    if (cell.hasPit) {
      this.sound.playSound(GameSound.WIND);
      return 'Sientes brisa.';
    }

    if (cell.hasGold) {
      this.sound.playSound(GameSound.GOLD);
      return 'Sientes un brillo.';
    }

    return null;
  }


}
