import { Cell } from './cell.model';
import { GameSettings } from './game-settings.model';
import { Chars, Hunter } from './hunter.model';

export interface GameState {
  board: Cell[][];
  hunter: Hunter;
  message: string;
  settings: GameSettings;
  wumpusKilled: number;
  isAlive: boolean;
  hasWon: boolean;
  lives: number;
  unlockedChars: Chars[];
}
