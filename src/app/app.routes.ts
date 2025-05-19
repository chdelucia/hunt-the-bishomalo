import { Route } from '@angular/router';
import { secretGuard } from './guards/secret.guard';
import { RouteTypes } from './models';

export const appRoutes: Route[] = [
  {
    path: RouteTypes.ACHIEVEMENTS,
    loadComponent: () => import('./components').then((mod) => mod.AchievementsComponent),
    title: 'Logros | Bisho malo',
  },
  {
    path: RouteTypes.JEDI,
    canActivate: [secretGuard],
    loadComponent: () => import('./components').then((mod) => mod.JediMindTrickAnimationComponent),
    title: 'Jedi secreto | Bisho malo',
  },
  {
    path: RouteTypes.CHARS,
    loadComponent: () => import('./components').then((mod) => mod.CharactersComponent),
    title: 'Jedi secreto | Bisho malo',
  },
  {
    path: RouteTypes.HOME,
    loadComponent: () =>
      import('./pages/hunt-bisho.component').then((mod) => mod.HuntBishoComponent),
    title: 'Game Bisho malo',
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
