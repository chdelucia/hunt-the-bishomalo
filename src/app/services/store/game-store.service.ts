import { Injectable, computed, signal } from '@angular/core';
import { Cell, Direction, Hunter, GameSettings } from '../../models';
import { LocalstorageService } from '../localstorage/localstorage.service';

@Injectable({ providedIn: 'root' })
export class GameStoreService {
  private readonly _board = signal<Cell[][]>([]);
  private readonly _hunter = signal<Hunter>({
    x: 0,
    y: 0,
    direction: Direction.RIGHT,
    arrows: 1,
    alive: true,
    hasGold: false,
    hasWon: false,
    wumpusKilled: false
  });

  private readonly _message = signal('');
  private _startTime: Date | null = null;
  private _settings!: GameSettings;

  readonly board = computed(() => this._board());
  readonly hunter = computed(() => this._hunter());
  readonly message = computed(() => this._message());
  prevName = 'Player';
 
  setSettings(settings: GameSettings): void {
    this._settings = settings;
  }

  resetSettings(): void {
    this.prevName = this.settings?.player || this.prevName;
    this._settings = undefined as unknown as GameSettings;
  }

  initBoard(): void {
    const size = this._settings.size;
    const board: Cell[][] = Array.from({ length: size }, (_, x) =>
      Array.from({ length: size }, (_, y) => ({
        x, y, visited: false,
        hasGold: false, hasPit: false, hasWumpus: false,
        isStart: x === 0 && y === 0,
      }))
    );

    const place = () => this.placeRandom(board);

    place().hasGold = true;

    for (let i = 0; i < (this._settings.wumpus || 1); i++) {
      place().hasWumpus = true;
    }
    for (let i = 0; i < this._settings.pits; i++) {
      place().hasPit = true;
    }

    for (let i = 0; i < (this._settings.wumpus - 1 || 0); i++) {
      place().hasArrow = true;
    }

    this._board.set(board);
    this.resetHunter();
    this._startTime = new Date();
  }

  private placeRandom(board: Cell[][]): Cell {
    let cell: Cell;
    const size = this._settings.size;
    do {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      cell = board[x][y];
    } while (
      cell.hasGold || cell.hasPit || cell.hasWumpus || (cell.x === 0 && cell.y === 0)
    );
    return cell;
  }

  private resetHunter(): void {
    this._hunter.set({
      x: 0,
      y: 0,
      direction: Direction.RIGHT,
      arrows: this._settings.arrows,
      alive: true,
      hasGold: false,
      hasWon: false,
      wumpusKilled: false
    });
  }

  updateHunter(partial: Partial<Hunter>): void {
    this._hunter.update(hunter => ({ ...hunter, ...partial }));
  }

  updateBoard(newBoard: Cell[][]): void {
    this._board.set(newBoard);
  }

  setMessage(message: string): void {
    this._message.set(message);
  }

  get settings(): GameSettings {
    return this._settings;
  }

  get startTime() {
    return this._startTime;
  }

  getCurrentCell(): Cell {
    const { x, y } = this._hunter();
    return this._board()[x][y];
  }

  markCellVisited(x: number, y: number): void {
    this._board.update(board => {
      board[x][y].visited = true;
      return [...board];
    });
  }
}
