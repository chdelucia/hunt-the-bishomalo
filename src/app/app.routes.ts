import { Route } from '@angular/router';
import { secretGuard } from './guards/secret.guard';
import { RouteTypes } from './models';
import { homeGuard } from './guards/home.guard';

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
    canActivate: [secretGuard],
    loadComponent: () => import('./pages').then((mod) => mod.CharactersComponent),
    title: 'Selecciona tu recompensa | Bisho malo',
  },
  {
    path: RouteTypes.SHOP,
    canActivate: [secretGuard],
    loadComponent: () => import('./pages').then((mod) => mod.ShopComponent),
    title: 'Tienda de objetos | Bisho malo',
  },
  {
    path: RouteTypes.CREDITS,
    loadComponent: () => import('./pages').then((mod) => mod.EndCreditsComponent),
    title: 'Creditos por Chris Heredia | Bisho malo',
  },
  {
    path: RouteTypes.RULES,
    loadComponent: () => import('./pages').then((mod) => mod.InstructionsComponent),
    title: 'Instrucciones | Bisho malo',
  },
  {
    path: RouteTypes.SETTINGS,
    loadComponent: () => import('./pages').then((mod) => mod.ConfigComponent),
    title: 'Configuracion | Bisho malo',
  },
  {
    path: RouteTypes.RESULTS,
    canActivate: [secretGuard],
    loadComponent: () => import('./pages').then((mod) => mod.ResultsComponent),
    title: 'Resultados de la partida | Bisho malo',
  },
  {
    path: RouteTypes.BOSS,
    canActivate: [secretGuard],
    loadComponent: () => import('./pages').then((mod) => mod.BossFightComponent),
    title: 'Final boss | Bisho malo',
  },
  {
    path: RouteTypes.STORY,
    canActivate: [secretGuard],
    loadComponent: () => import('./pages').then((mod) => mod.StoryComponent),
    title: 'Storytelling | Bisho malo',
  },
  {
    path: RouteTypes.HOME,
    canActivate: [homeGuard],
    loadComponent: () => import('./pages').then((mod) => mod.HuntBishoComponent),
    title: 'Game Bisho malo',
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () => import('./pages').then((mod) => mod.NotFoundComponent),
    title: '404 not found | Bisho malo',
  },
];
