import { Route } from '@angular/router';
import { secretGuard } from './guards/secret.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('@hunt-the-bishomalo/game-shell').then((m) => m.gameRoutes),
  },
  {
    path: '',
    loadChildren: () => import('@hunt-the-bishomalo/settings-shell').then((m) => m.settingsRoutes),
  },
  {
    path: 'credits',
    loadComponent: () => import('@hunt-the-bishomalo/shared-feature').then((m) => m.EndCreditsComponent),
    title: 'Creditos por Chris Heredia | Bisho malo',
  },
  {
    path: 'jedi',
    canActivate: [secretGuard],
    loadComponent: () => import('@hunt-the-bishomalo/shared-feature').then((m) => m.JediMindTrickAnimationComponent),
    title: 'Jedi secreto | Bisho malo',
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () => import('@hunt-the-bishomalo/shared-feature').then((m) => m.NotFoundComponent),
    title: '404 not found | Bisho malo',
  },
];
