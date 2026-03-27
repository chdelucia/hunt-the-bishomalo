import { InjectionToken } from '@angular/core';

export interface IGameSideEffect {
  readonly brand: 'IGameSideEffect';
}

export const GAME_SIDE_EFFECT_TOKEN = new InjectionToken<IGameSideEffect>('GAME_SIDE_EFFECT_TOKEN');
