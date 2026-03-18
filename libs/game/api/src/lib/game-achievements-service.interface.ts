import { InjectionToken } from '@angular/core';
import { Cell } from '@hunt-the-bishomalo/data';

export interface IGameAchievementsService {
  calcVictoryAchieve(seconds: number): void;
  handleWumpusKillAchieve(cell: Cell): void;
  isAllCompleted(): void;
}

export const GAME_ACHIEVEMENTS_SERVICE = new InjectionToken<IGameAchievementsService>(
  'GAME_ACHIEVEMENTS_SERVICE'
);
