import { InjectionToken } from '@angular/core';
import { Cell } from '@hunt-the-bishomalo/data';

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
  calcVictoryAchieve(seconds: number): void;
  handleWumpusKillAchieve(cell: Cell): void;
}

export const GAME_ENGINE_TOKEN = new InjectionToken<IGameEngineService>('GAME_ENGINE_TOKEN');
