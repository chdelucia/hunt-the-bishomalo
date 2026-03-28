import { Route } from '@angular/router';
import { secretGuard } from './guards/secret.guard';
import { RouteTypes } from '@hunt-the-bishomalo/shared-data';
import { homeGuard } from './guards/home.guard';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const appRoutes: Route[] = [
  {
    path: RouteTypes.ACHIEVEMENTS,
    loadChildren: () =>
      loadRemoteModule('achievements', './Routes').then((mod) => mod.achievementsRoutes),
    title: 'Logros | Bisho malo',
    data: { preload: true },
  },
  {
    path: RouteTypes.JEDI,
    canActivate: [secretGuard],
    loadChildren: () => import('@hunt-the-bishomalo/game/shell').then((mod) => mod.gameRoutes),
    title: 'Jedi secreto | Bisho malo',
    data: { preload: true },
  },
  {
    path: RouteTypes.CHARS,
    canActivate: [secretGuard],
    loadChildren: () => import('@hunt-the-bishomalo/chars/shell').then((mod) => mod.charsRoutes),
    title: 'Selecciona tu recompensa | Bisho malo',
    data: { preload: true },
  },
  {
    path: RouteTypes.SHOP,
    canActivate: [secretGuard],
    loadChildren: () => import('@hunt-the-bishomalo/shop/shell').then((mod) => mod.shopRoutes),
    title: 'Tienda de objetos | Bisho malo',
    data: { preload: true },
  },
  {
    path: RouteTypes.CREDITS,
    loadChildren: () =>
      import('@hunt-the-bishomalo/credits/shell').then((mod) => mod.creditsRoutes),
    title: 'Creditos por Chris Heredia | Bisho malo',
    data: { preload: true },
  },
  {
    path: RouteTypes.RULES,
    loadChildren: () =>
      import('@hunt-the-bishomalo/instructions/shell').then((mod) => mod.instructionsRoutes),
    title: 'Instrucciones | Bisho malo',
    data: { preload: true },
  },
  {
    path: RouteTypes.SETTINGS,
    loadChildren: () => import('@hunt-the-bishomalo/config/shell').then((mod) => mod.configRoutes),
    title: 'Configuracion | Bisho malo',
    data: { preload: true },
  },
  {
    path: RouteTypes.RESULTS,
    canActivate: [secretGuard],
    loadChildren: () =>
      import('@hunt-the-bishomalo/gamestats/shell').then((mod) => mod.gamestatsRoutes),
    title: 'Resultados de la partida | Bisho malo',
    data: { preload: true },
  },
  {
    path: RouteTypes.BOSS,
    canActivate: [secretGuard],
    loadChildren: () => import('@hunt-the-bishomalo/boss/shell').then((mod) => mod.bossRoutes),
    title: 'Final boss | Bisho malo',
    data: { preload: true },
  },
  {
    path: RouteTypes.STORY,
    canActivate: [secretGuard],
    loadChildren: () => import('@hunt-the-bishomalo/story/shell').then((mod) => mod.storyRoutes),
    title: 'Storytelling | Bisho malo',
    data: { preload: true },
  },
  {
    path: RouteTypes.HOME,
    canActivate: [homeGuard],
    loadChildren: () => import('@hunt-the-bishomalo/game/shell').then((mod) => mod.gameRoutes),
    title: 'Game Bisho malo',
    data: { preload: true },
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () => import('./pages').then((mod) => mod.NotFoundComponent),
    title: '404 not found | Bisho malo',
  },
];
