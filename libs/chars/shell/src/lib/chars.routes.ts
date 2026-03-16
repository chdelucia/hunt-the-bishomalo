import { Routes } from '@angular/router';

export const charsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@hunt-the-bishomalo/chars/feature').then(m => m.CharactersComponent)
  }
];
