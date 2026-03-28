import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('@hunt-the-bishomalo/achievements/shell').then(m => m.achievementsRoutes)
  }
];
