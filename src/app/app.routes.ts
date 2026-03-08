import { Route } from '@angular/router';
import { secretGuard } from './guards/secret.guard';
import { RouteTypes } from '@hunt-the-bishomalo/data';
import { homeGuard } from './guards/home.guard';

export const appRoutes: Route[] = [
  {
    path: RouteTypes.ACHIEVEMENTS,
    loadComponent: () =>
      import('./components/achievements/achievements.component').then(
        (mod) => mod.AchievementsComponent,
      ),
    title: 'Logros | Bisho malo',
  },
  {
    path: RouteTypes.JEDI,
    canActivate: [secretGuard],
    loadComponent: () =>
      import('./components/animations/jedi/jedi-mind-trick-animation.component').then(
        (mod) => mod.JediMindTrickAnimationComponent,
      ),
    title: 'Jedi secreto | Bisho malo',
  },
  {
    path: RouteTypes.CHARS,
    canActivate: [secretGuard],
    loadComponent: () =>
      import('@hunt-the-bishomalo/chars').then((mod) => mod.CharactersComponent),
    title: 'Selecciona tu recompensa | Bisho malo',
  },
  {
    path: RouteTypes.SHOP,
    canActivate: [secretGuard],
    loadComponent: () => import('@hunt-the-bishomalo/shop').then((mod) => mod.ShopComponent),
    title: 'Tienda de objetos | Bisho malo',
  },
  {
    path: RouteTypes.CREDITS,
    loadComponent: () =>
      import('@hunt-the-bishomalo/credits').then((mod) => mod.EndCreditsComponent),
    title: 'Creditos por Chris Heredia | Bisho malo',
  },
  {
    path: RouteTypes.RULES,
    loadComponent: () =>
      import('@hunt-the-bishomalo/instructions').then((mod) => mod.InstructionsComponent),
    title: 'Instrucciones | Bisho malo',
  },
  {
    path: RouteTypes.SETTINGS,
    loadComponent: () => import('@hunt-the-bishomalo/config').then((mod) => mod.ConfigComponent),
    title: 'Configuracion | Bisho malo',
  },
  {
    path: RouteTypes.RESULTS,
    canActivate: [secretGuard],
    loadComponent: () =>
      import('@hunt-the-bishomalo/gamestats').then((mod) => mod.ResultsComponent),
    title: 'Resultados de la partida | Bisho malo',
  },
  {
    path: RouteTypes.BOSS,
    canActivate: [secretGuard],
    loadComponent: () => import('@hunt-the-bishomalo/boss').then((mod) => mod.BossFightComponent),
    title: 'Final boss | Bisho malo',
  },
  {
    path: RouteTypes.STORY,
    canActivate: [secretGuard],
    loadComponent: () => import('@hunt-the-bishomalo/story').then((mod) => mod.StoryComponent),
    title: 'Storytelling | Bisho malo',
  },
  {
    path: RouteTypes.HOME,
    canActivate: [homeGuard],
    loadComponent: () => import('./pages/hunt-bisho.component').then((mod) => mod.HuntBishoComponent),
    title: 'Game Bisho malo',
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/404/not-found.component').then((mod) => mod.NotFoundComponent),
    title: '404 not found | Bisho malo',
  },
];
