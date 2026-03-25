import { Routes } from '@angular/router';
import { ACHIEVEMENT_SERVICE, ACHIEVEMENTS_LIST_TOKEN } from '@hunt-the-bishomalo/achievements/api';
import { AchievementService, ACHIEVEMENTS_LIST } from '../data-access/index';

export const achievementsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../feature/achievements').then(m => m.AchievementsComponent),
    providers: [
      { provide: ACHIEVEMENTS_LIST_TOKEN, useValue: ACHIEVEMENTS_LIST },
      { provide: ACHIEVEMENT_SERVICE, useClass: AchievementService },
    ]
  }
];
