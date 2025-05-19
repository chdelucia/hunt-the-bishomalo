import { Chars } from "./hunter.model";

export interface GameSettings {
  size: number;
  pits: number;
  arrows: number;
  player: string;
  wumpus: number;
  blackout?: boolean;
  selectedChar: Chars;
}
