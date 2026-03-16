import { Routes } from '@angular/router';

export const creditsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@hunt-the-bishomalo/credits/feature').then(m => m.EndCreditsComponent)
  }
];
