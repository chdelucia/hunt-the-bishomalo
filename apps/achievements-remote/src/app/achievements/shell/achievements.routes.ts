import { Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ACHIEVEMENT_SERVICE } from '../data-access/achievement-service.interface';
import { AchievementService } from '../data-access/index';

export const achievementsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../feature/achievements').then(m => m.AchievementsComponent),
    providers: [
      provideHttpClient(),
      { provide: ACHIEVEMENT_SERVICE, useClass: AchievementService },
    ]
  }
];
