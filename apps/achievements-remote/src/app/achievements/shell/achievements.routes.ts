import { Routes } from '@angular/router';
import { ACHIEVEMENT_SERVICE, ACHIEVEMENTS_LIST_TOKEN } from '@hunt-the-bishomalo/achievements/api';
import { AchievementService } from '../data-access/achievement.service';
import { ACHIEVEMENTS_LIST } from '../data-access/achievements.const';

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
