import { GameEventEffectType } from "./game-effects.types";

export interface GameItem {
  name: string;
  image: string;
  effect: GameEventEffectType;
}
