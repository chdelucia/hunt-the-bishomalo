import { Direction } from "./direction.enum";
import { GameItem } from "./game-item.model";

export interface Hunter {
  x: number;
  y: number;
  direction: Direction;
  arrows: number;
  alive: boolean;
  hasGold: boolean;
  hasWon: boolean;
  wumpusKilled?: boolean;
  lives: number;
  inventory?: GameItem[];
  gold?: number;
}
