import { InjectionToken, Signal } from '@angular/core';
import { Achievement, AchieveTypes, Cell } from '@hunt-the-bishomalo/data';

export interface IAchievementService {
  achievements: Achievement[];
  completed: Signal<Achievement | undefined>;
  activeAchievement: (id: AchieveTypes | string) => void;
  calcVictoryAchieve: (seconds: number) => void;
  handleWumpusKillAchieve: (cell: Cell) => void;
  isAllCompleted: () => void;
}

export const ACHIEVEMENT_SERVICE = new InjectionToken<IAchievementService>('ACHIEVEMENT_SERVICE');
