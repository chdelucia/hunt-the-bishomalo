import { Injectable, computed, signal } from '@angular/core';
import { Cell, Direction, Hunter, GameSettings, CELL_CONTENTS } from '../../models';
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
    wumpusKilled: false,
    lives: 8
  });

  private readonly _message = signal('');
  private _startTime: Date | null = null;
  private readonly _settings = signal<GameSettings>({} as GameSettings);

  readonly board = computed(() => this._board());
  readonly hunter = computed(() => this._hunter());
  readonly message = computed(() => this._message());
  readonly settings = computed(() => this._settings());

  private readonly storageHunterKey = 'hunt_the_bishomalo_hunter';

  prevName = 'Player';

  constructor(private readonly localStorageService: LocalstorageService){
    this.syncHunterWithStorage();
  }

  syncHunterWithStorage(): void {
    const hunter = this.localStorageService.getValue<Hunter>(this.storageHunterKey);
    if(hunter) this._hunter.set(hunter);
  }

  initBoard(): void {
    const size = this._settings().size;
    const board: Cell[][] = Array.from({ length: size }, (_, x) =>
      Array.from({ length: size }, (_, y) => ({
        x, y, visited: false,
        hasGold: false, hasPit: false, hasWumpus: false,
      }))
    );

    const place = () => this.placeRandom(board);

    place().hasGold = true;

    for (let i = 0; i < (this._settings().wumpus || 1); i++) {
      place().hasWumpus = true;
    }
    for (let i = 0; i < this._settings().pits; i++) {
      place().hasPit = true;
    }

    for (let i = 0; i < (this._settings().wumpus - 1 || 0); i++) {
      place().content = CELL_CONTENTS.arrow
    }

    this.applyRandomEventOnce(board);

    this._board.set(board);
    this.setHunterForNextLevel();
    this._startTime = new Date();
  }

  applyRandomEventOnce(board: Cell[][]): void {
    const baseChance = 0.1;
    const maxChance = 0.25;
    const size = this.settings().size;

    const chance = Math.min(
      baseChance + ((size - 4) / (20 - 4)) * (maxChance - baseChance),
      maxChance
    );

    const shouldPlaceEvent = Math.random() < chance;

    if (shouldPlaceEvent) {
      this.placeRandom(board).content = CELL_CONTENTS.heart;
    }
  }


  setSettings(settings: GameSettings): void {
    this._settings.set(settings);
  }

  resetSettings(): void {
    this.prevName = this._settings()?.player || this.prevName;
    this._settings.set({} as GameSettings);
  }

  private placeRandom(board: Cell[][]): Cell {
    let cell: Cell;
    const size = this._settings().size;
    do {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      cell = board[x][y];
    } while (
      cell.hasGold || cell.hasPit || cell.hasWumpus || (cell.x === 0 && cell.y === 0)
    );
    return cell;
  }

  private setHunterForNextLevel(): void {
    this.updateHunter({      
      x: 0,
      y: 0,
      direction: Direction.RIGHT,
      arrows: this._settings().arrows,
      alive: true,
      hasGold: false,
      hasWon: false,
      wumpusKilled: false
    })
  }
  
  resetHunter(): void {
    this._hunter.set({
      x: 0,
      y: 0,
      direction: Direction.RIGHT,
      arrows: this._settings().arrows,
      alive: true,
      hasGold: false,
      hasWon: false,
      wumpusKilled: false,
      lives: 8
    });
  }

  updateHunter(partial: Partial<Hunter>): void {
    this._hunter.update(hunter => ({ ...hunter, ...partial }));
    //TODO solo actualizar cuando se gana o se pierde no siempre
    this.localStorageService.setValue<Hunter>(this.storageHunterKey, this._hunter());
  }

  updateBoard(newBoard: Cell[][]): void {
    this._board.set(newBoard);
  }

  setMessage(message: string): void {
    this._message.set(message);
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
