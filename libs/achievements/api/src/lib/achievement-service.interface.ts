import { InjectionToken, Signal } from '@angular/core';
import { Achievement, AchieveTypes } from '@hunt-the-bishomalo/shared-data';

export interface IAchievementService {
  achievements: Signal<Achievement[]>;
  completed: Signal<Achievement | undefined>;
  activeAchievement: (id: AchieveTypes | string) => void;
  isAllCompleted: () => void;
}

export const ACHIEVEMENT_SERVICE = new InjectionToken<IAchievementService>('ACHIEVEMENT_SERVICE');

export const ACHIEVEMENTS_LIST_TOKEN = new InjectionToken<Achievement[]>('ACHIEVEMENTS_LIST_TOKEN');
