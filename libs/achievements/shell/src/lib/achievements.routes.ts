import { Routes } from '@angular/router';

export const achievementsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@hunt-the-bishomalo/achievements/feature').then(m => m.AchievementsComponent)
  }
];
