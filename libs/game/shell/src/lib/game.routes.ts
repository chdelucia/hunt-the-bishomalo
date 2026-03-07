import { Route } from '@angular/router';
import { secretGuard } from '@hunt-the-bishomalo/guards';
import { homeGuard } from '@hunt-the-bishomalo/guards';

export const gameRoutes: Route[] = [
  {
    path: 'achievements',
    loadComponent: () => import('@hunt-the-bishomalo/game-feature').then((m) => m.AchievementsComponent),
    title: 'Logros | Bisho malo',
  },
  {
    path: 'chars',
    canActivate: [secretGuard],
    loadComponent: () => import('@hunt-the-bishomalo/game-feature').then((m) => m.CharactersComponent),
    title: 'Selecciona tu recompensa | Bisho malo',
  },
  {
    path: 'shop',
    canActivate: [secretGuard],
    loadComponent: () => import('@hunt-the-bishomalo/game-feature').then((m) => m.ShopComponent),
    title: 'Tienda de objetos | Bisho malo',
  },
  {
    path: 'results',
    canActivate: [secretGuard],
    loadComponent: () => import('@hunt-the-bishomalo/game-feature').then((m) => m.ResultsComponent),
    title: 'Resultados de la partida | Bisho malo',
  },
  {
    path: 'boss',
    canActivate: [secretGuard],
    loadComponent: () => import('@hunt-the-bishomalo/game-feature').then((m) => m.BossFightComponent),
    title: 'Final boss | Bisho malo',
  },
  {
    path: 'story',
    canActivate: [secretGuard],
    loadComponent: () => import('@hunt-the-bishomalo/game-feature').then((m) => m.StoryComponent),
    title: 'Storytelling | Bisho malo',
  },
  {
    path: 'home',
    canActivate: [homeGuard],
    loadComponent: () => import('@hunt-the-bishomalo/game-feature').then((m) => m.HuntBishoComponent),
    title: 'Game Bisho malo',
  },
];
