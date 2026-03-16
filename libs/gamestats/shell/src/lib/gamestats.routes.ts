import { Routes } from '@angular/router';

export const gamestatsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@hunt-the-bishomalo/gamestats/feature').then(m => m.ResultsComponent)
  }
];
