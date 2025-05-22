import { Injectable, computed, signal } from '@angular/core';
import { Cell, Direction, Hunter, GameSettings, CELL_CONTENTS, Chars } from '../../models';
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
    wumpusKilled: 0,
    lives: 8,
    chars: [Chars.DEFAULT],
    gold: 0,
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

  constructor(private readonly localStorageService: LocalstorageService) {
    this.syncHunterWithStorage();
  }

  syncHunterWithStorage(): void {
    const hunter = this.localStorageService.getValue<Hunter>(this.storageHunterKey);
    if (hunter) this._hunter.set(hunter);
  }

  initBoard(): void {
    const size = this._settings().size;
    const board: Cell[][] = Array.from({ length: size }, (_, x) =>
      Array.from({ length: size }, (_, y) => ({ x, y, visited: false })),
    );

    const baseExclusions = new Set(['0,0']);

    const place = (extraExclusions: Set<string> = new Set()) => {
      const combinedExclusions = new Set([...baseExclusions, ...extraExclusions]);
      return this.placeRandom(board, combinedExclusions);
    };

    place().content = CELL_CONTENTS.gold;

    for (let i = 0; i < (this._settings().wumpus || 1); i++) {
      place().content = CELL_CONTENTS.wumpus;
    }

    const pitExtraExclusions = new Set(['0,1', '1,0']);
    for (let i = 0; i < this._settings().pits; i++) {
      place(pitExtraExclusions).content = CELL_CONTENTS.pit;
    }

    for (let i = 0; i < (this._settings().wumpus || 1) - 1; i++) {
      place().content = CELL_CONTENTS.arrow;
    }

    this.applyRandomEventOnce(board);
    this._board.set(board);
    this.setHunterForNextLevel();
    this._startTime = new Date();
  }

  private placeRandom(board: Cell[][], excluded: Set<string>): Cell {
    const size = this._settings().size;
    let cell: Cell;
    do {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      cell = board[x][y];
    } while (cell.content || excluded.has(`${cell.x},${cell.y}`));
    return cell;
  }

  applyRandomEventOnce(board: Cell[][]): void {
    const baseChance = 0.12;
    const maxChance = 0.33;
    const size = this.settings().size;

    const chance = Math.min(
      baseChance + ((size - 4) / (16 - 4)) * (maxChance - baseChance),
      maxChance,
    );

    const shouldPlaceEvent = Math.random() < chance;

    if (shouldPlaceEvent && this._hunter().lives < 8) {
      this.placeRandom(board, new Set(['0,0'])).content = CELL_CONTENTS.heart;
    }
  }

  setSettings(settings: GameSettings): void {
    this._settings.set(settings);
  }

  resetSettings(): void {
    this.prevName = this._settings()?.player || this.prevName;
    this._settings.set({} as GameSettings);
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
      wumpusKilled: 0,
    });
  }

  resetHunter(): void {
    this.updateHunter({
      x: 0,
      y: 0,
      direction: Direction.RIGHT,
      arrows: this._settings().arrows,
      alive: true,
      hasGold: false,
      hasWon: false,
      wumpusKilled: 0,
      lives: 8,
      gold: 0,
    });
    this.localStorageService.setValue<Hunter>(this.storageHunterKey, this._hunter());
  }

  updateHunter(partial: Partial<Hunter>): void {
    this._hunter.update((hunter) => ({ ...hunter, ...partial }));

    if (!partial.alive || partial.hasWon) {
      const hunterLo = { ...this._hunter(), hasGold: false, hasWon: false, wumpusKilled: 0 };
      this.localStorageService.setValue<Hunter>(this.storageHunterKey, hunterLo);
    }
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
}
