import { Route } from '@angular/router';
import {
  GAME_ACHIEVEMENT_TRACKER_TOKEN,
  GAME_ENGINE_TOKEN,
  GAME_FACADE_TOKEN,
  GAME_SIDE_EFFECT_TOKEN,
  GAME_STATS_TRACKER_TOKEN,
} from '@hunt-the-bishomalo/game/api';
import {
  GameAchievementTrackerService,
  GameEngineService,
  GameFacade,
  GameSideEffectService,
  GameStatsTrackerService,
} from '@hunt-the-bishomalo/game/data-access';

export const gameRoutes: Route[] = [
  {
    path: '',
    providers: [
      { provide: GAME_ENGINE_TOKEN, useClass: GameEngineService },
      { provide: GAME_ACHIEVEMENT_TRACKER_TOKEN, useClass: GameAchievementTrackerService },
      { provide: GAME_STATS_TRACKER_TOKEN, useClass: GameStatsTrackerService },
      { provide: GAME_SIDE_EFFECT_TOKEN, useClass: GameSideEffectService },
      { provide: GAME_FACADE_TOKEN, useClass: GameFacade },
    ],
    loadComponent: () => import('@hunt-the-bishomalo/game/feature').then((m) => m.Game),
  },
  {
    path: 'secret',
    loadComponent: () =>
      import('@hunt-the-bishomalo/game/feature').then((m) => m.JediMindTrickAnimationComponent),
  },
];
