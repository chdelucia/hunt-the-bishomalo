import { InjectionToken, Signal } from '@angular/core';
import { Achievement, AchieveTypes } from '@hunt-the-bishomalo/data';

export interface IAchievementService {
  achievements: Achievement[];
  completed: Signal<Achievement | undefined>;
  activeAchievement: (id: AchieveTypes | string) => void;
  isAllCompleted: () => void;
}

export const ACHIEVEMENT_SERVICE = new InjectionToken<IAchievementService>('ACHIEVEMENT_SERVICE');

export const ACHIEVEMENTS_LIST_TOKEN = new InjectionToken<Achievement[]>('ACHIEVEMENTS_LIST_TOKEN');
