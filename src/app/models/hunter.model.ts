import { Direction } from './direction.enum';
import { GameItem } from './game-item.model';

export enum Chars {
  DEFAULT = 'default',
  LINK = 'link',
  LARA = 'lara',
  LEGOLAS = 'legolas',
}

export interface Hunter {
  x: number;
  y: number;
  direction: Direction;
  arrows: number;
  alive: boolean;
  hasGold: boolean;
  hasWon: boolean;
  wumpusKilled: number;
  lives: number;
  inventory?: GameItem[];
  gold: number;
  chars?: Chars[];
  dragonballs?: number;
}
