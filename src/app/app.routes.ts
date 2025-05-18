import { Route } from '@angular/router';
import { secretGuard } from './guards/secret.guard';

export const appRoutes: Route[] = [
  {
    path: 'logros',
    loadComponent: () => import('./components').then((mod) => mod.AchievementsComponent),
    title: 'Logros | Bisho malo',
  },
  {
    path: 'secret',
    canActivate: [secretGuard],
    loadComponent: () => import('./components').then((mod) => mod.JediMindTrickAnimationComponent),
    title: 'Jedi secreto | Bisho malo',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/hunt-bisho.component').then((mod) => mod.HuntBishoComponent),
    title: 'Game Bisho malo',
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
