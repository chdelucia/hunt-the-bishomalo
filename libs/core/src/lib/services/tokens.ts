import { InjectionToken } from '@angular/core';
import { AchieveTypes, Cell } from '@hunt-the-bishomalo/data';

export const ACHIEVEMENT_SERVICE = new InjectionToken<{
  activeAchievement: (id: AchieveTypes) => void;
  caclVictoryAchieve: (seconds: number) => void;
  handleWumpusKillAchieve: (cell: Cell) => void;
}>('ACHIEVEMENT_SERVICE');

export const LEADERBOARD_SERVICE = new InjectionToken<{
  clear: () => void;
}>('LEADERBOARD_SERVICE');
