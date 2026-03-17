import { Direction } from './direction.enum';
import { GameItem } from './game-item.model';
import { Point } from './position.model';

export enum Chars {
  DEFAULT = 'default',
  LINK = 'link',
  LARA = 'lara',
  LEGOLAS = 'legolas',
}

export interface Hunter extends Point {
  direction: Direction;
  arrows: number;
  hasGold: boolean;
  inventory: GameItem[];
  gold: number;
  dragonballs?: number;
}
