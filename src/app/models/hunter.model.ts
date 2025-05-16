import { Direction } from "./direction.enum";

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
}
