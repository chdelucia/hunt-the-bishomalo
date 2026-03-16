import { Routes } from '@angular/router';

export const configRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@hunt-the-bishomalo/config/feature').then(m => m.ConfigComponent)
  }
];
