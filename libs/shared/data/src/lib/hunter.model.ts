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
  hasGold: boolean;
  inventory: GameItem[];
  gold: number;
  dragonballs?: number;
}
