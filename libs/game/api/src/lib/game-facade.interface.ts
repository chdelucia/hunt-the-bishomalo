import { InjectionToken, Signal } from '@angular/core';
import { Cell, GameSettings, GameItem } from '@hunt-the-bishomalo/shared-data';

export interface IGameFacade {
  readonly board: Signal<Cell[][]>;
  readonly isAlive: Signal<boolean>;
  readonly hasWon: Signal<boolean>;
  readonly settings: Signal<GameSettings>;
  readonly message: Signal<string>;
  readonly lives: Signal<number>;
  readonly currentCell: Signal<Cell | null>;
  readonly inventory: Signal<GameItem[]>;
  readonly wumpusKilled: Signal<number>;
  readonly soundEnabled: Signal<boolean>;
  readonly dragonballs: Signal<number>;
  readonly gold: Signal<number>;
  readonly hunter: Signal<any>;
  readonly blackout: Signal<boolean>;

  moveForward(): void;
  turnLeft(): void;
  turnRight(): void;
  shootArrow(): void;
  newGame(): void;
  toggleSound(): void;
}

export const GAME_FACADE_TOKEN = new InjectionToken<IGameFacade>('GAME_FACADE_TOKEN');
