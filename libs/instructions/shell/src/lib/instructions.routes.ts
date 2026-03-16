import { Routes } from '@angular/router';

export const instructionsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@hunt-the-bishomalo/instructions/feature').then(m => m.InstructionsComponent)
  }
];
