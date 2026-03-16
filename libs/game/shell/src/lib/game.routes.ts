import { Route } from '@angular/router';

export const gameRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('@hunt-the-bishomalo/game/feature').then((m) => m.Game),
  },
  {
    path: 'secret',
    loadComponent: () =>
      import('@hunt-the-bishomalo/game/feature').then((m) => m.JediMindTrickAnimationComponent),
  },
];
