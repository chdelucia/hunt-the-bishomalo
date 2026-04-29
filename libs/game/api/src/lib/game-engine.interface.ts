import { InjectionToken } from '@angular/core';
import { Cell, GameSettings } from '@hunt-the-bishomalo/shared-data';

export interface IGameEngineService {
  initGame(): void;
  newGame(): void;
  nextLevel(): void;
  moveForward(): void;
  turnLeft(): void;
  turnRight(): void;
  shootArrow(): void;
  exit(): void;
  initializeGameBoard(settings?: GameSettings): void;
  calcVictoryAchieve(seconds: number): void;
  handleWumpusKillAchieve(cell: Cell): void;
}

export const GAME_ENGINE_TOKEN = new InjectionToken<IGameEngineService>('GAME_ENGINE_TOKEN');
