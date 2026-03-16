import { Routes } from '@angular/router';

export const bossRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@hunt-the-bishomalo/boss/feature').then(m => m.BossFightComponent)
  }
];
