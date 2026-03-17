import { InjectionToken } from '@angular/core';

export interface IGameEngineService {
  initGame(): void;
  newGame(): void;
  nextLevel(): void;
  moveForward(): void;
  turnLeft(): void;
  turnRight(): void;
  shootArrow(): void;
  exit(): void;
  initializeGameBoard(): void;
}

export const GAME_ENGINE_TOKEN = new InjectionToken<IGameEngineService>('GAME_ENGINE_TOKEN');
