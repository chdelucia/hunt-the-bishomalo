import { InjectionToken } from '@angular/core';
import { AchieveTypes, Cell } from '@hunt-the-bishomalo/data';

export interface IGameAchievementsService {
  calcVictoryAchieve(seconds: number): void;
  handleWumpusKillAchieve(cell: Cell): void;
  isAllCompleted(): void;
  activeAchievement(id: AchieveTypes | string): void;
}

export const GAME_ACHIEVEMENTS_SERVICE = new InjectionToken<IGameAchievementsService>(
  'GAME_ACHIEVEMENTS_SERVICE'
);
