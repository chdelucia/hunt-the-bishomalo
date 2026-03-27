import { InjectionToken } from '@angular/core';
import { Cell, AchieveTypes } from '@hunt-the-bishomalo/shared-data';

export interface IGameAchievementTracker {
  calcVictoryAchieve(seconds: number): void;
  handleWumpusKillAchieve(cell: Cell): void;
  activeAchievement(id: AchieveTypes | string): void;
}

export const GAME_ACHIEVEMENT_TRACKER_TOKEN = new InjectionToken<IGameAchievementTracker>('GAME_ACHIEVEMENT_TRACKER_TOKEN');
