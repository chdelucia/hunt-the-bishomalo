import { GameEventEffectType } from './game-effects.types';

export interface GameItem {
  name: string;
  icon: string;
  effect: GameEventEffectType;
}

export interface Product extends GameItem {
  price: number;
  description: string;
}
