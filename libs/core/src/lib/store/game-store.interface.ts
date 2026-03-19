import { InjectionToken, Signal } from '@angular/core';
import { Cell, GameSettings, Hunter, Chars, GameState } from '@hunt-the-bishomalo/data';

export interface IGameStore {
  readonly board: Signal<Cell[][]>;
  readonly isAlive: Signal<boolean>;
  readonly hasWon: Signal<boolean>;
  readonly settings: Signal<GameSettings>;
  readonly message: Signal<string>;
  readonly lives: Signal<number>;
  readonly hasGold: Signal<boolean>;
  readonly currentCell: Signal<Cell | null>;
  readonly inventory: Signal<any[]>; // Use any or a generic item type if needed
  readonly hunter: Signal<Hunter>;
  readonly unlockedChars: Signal<Chars[]>;
  readonly wumpusKilled: Signal<number>;
  readonly startTime: Signal<string>;
  readonly blackout: Signal<boolean>;
  readonly dragonballs: Signal<number>;
  readonly gold: Signal<number>;

  updateHunter(partial: Partial<Hunter>): void;
  updateGame(partial: Partial<GameState>): void;
  countWumpusKilled(): void;
  setMessage(message: string): void;
  resetStore(): void;
}

export const GAME_STORE_TOKEN = new InjectionToken<IGameStore>('GAME_STORE_TOKEN');
