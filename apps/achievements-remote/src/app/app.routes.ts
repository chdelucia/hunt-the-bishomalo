import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('./achievements/shell/achievements.routes').then(m => m.achievementsRoutes)
  }
];
