import { Route } from '@angular/router';
import { secretGuard } from './guards/secret.guard';
import { RouteTypes } from '@hunt-the-bishomalo/data';
import { homeGuard } from './guards/home.guard';

export const appRoutes: Route[] = [
  {
    path: RouteTypes.ACHIEVEMENTS,
    loadChildren: () =>
      import('@hunt-the-bishomalo/achievements/shell').then((mod) => mod.achievementsRoutes),
    title: 'Logros | Bisho malo',
  },
  {
    path: RouteTypes.JEDI,
    canActivate: [secretGuard],
    loadChildren: () => import('@hunt-the-bishomalo/game/shell').then((mod) => mod.gameRoutes),
    title: 'Jedi secreto | Bisho malo',
  },
  {
    path: RouteTypes.CHARS,
    canActivate: [secretGuard],
    loadChildren: () => import('@hunt-the-bishomalo/chars/shell').then((mod) => mod.charsRoutes),
    title: 'Selecciona tu recompensa | Bisho malo',
  },
  {
    path: RouteTypes.SHOP,
    canActivate: [secretGuard],
    loadChildren: () => import('@hunt-the-bishomalo/shop/shell').then((mod) => mod.shopRoutes),
    title: 'Tienda de objetos | Bisho malo',
  },
  {
    path: RouteTypes.CREDITS,
    loadChildren: () => import('@hunt-the-bishomalo/credits/shell').then((mod) => mod.creditsRoutes),
    title: 'Creditos por Chris Heredia | Bisho malo',
  },
  {
    path: RouteTypes.RULES,
    loadChildren: () => import('@hunt-the-bishomalo/instructions/shell').then((mod) => mod.instructionsRoutes),
    title: 'Instrucciones | Bisho malo',
  },
  {
    path: RouteTypes.SETTINGS,
    loadChildren: () => import('@hunt-the-bishomalo/config/shell').then((mod) => mod.configRoutes),
    title: 'Configuracion | Bisho malo',
  },
  {
    path: RouteTypes.RESULTS,
    canActivate: [secretGuard],
    loadChildren: () => import('@hunt-the-bishomalo/gamestats/shell').then((mod) => mod.gamestatsRoutes),
    title: 'Resultados de la partida | Bisho malo',
  },
  {
    path: RouteTypes.BOSS,
    canActivate: [secretGuard],
    loadChildren: () => import('@hunt-the-bishomalo/boss/shell').then((mod) => mod.bossRoutes),
    title: 'Final boss | Bisho malo',
  },
  {
    path: RouteTypes.STORY,
    canActivate: [secretGuard],
    loadChildren: () => import('@hunt-the-bishomalo/story/shell').then((mod) => mod.storyRoutes),
    title: 'Storytelling | Bisho malo',
  },
  {
    path: RouteTypes.HOME,
    canActivate: [homeGuard],
    loadChildren: () => import('@hunt-the-bishomalo/game/shell').then((mod) => mod.gameRoutes),
    title: 'Game Bisho malo',
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () => import('./pages').then((mod) => mod.NotFoundComponent),
    title: '404 not found | Bisho malo',
  },
];
