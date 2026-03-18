import {
  ApplicationConfig,
  provideZonelessChangeDetection,
  isDevMode,
  APP_INITIALIZER,
  ErrorHandler,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withHashLocation,
  withInMemoryScrolling,
  Router,
} from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { TranslocoHttpLoader } from './utils/transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import { GAME_STORE } from '@hunt-the-bishomalo/story/api';
import { GameStore } from '@hunt-the-bishomalo/core/store';
import { MonitoringService } from '@hunt-the-bishomalo/core/services';
import {
  ACHIEVEMENT_SERVICE,
  ACHIEVEMENTS_LIST_TOKEN,
} from '@hunt-the-bishomalo/achievements/api';
import {
  GAME_ACHIEVEMENTS_SERVICE,
  GAME_ENGINE_TOKEN,
} from '@hunt-the-bishomalo/game/api';
import { LEADERBOARD_SERVICE } from '@hunt-the-bishomalo/gamestats/api';
import { AchievementService } from '@hunt-the-bishomalo/achievements/data-access';
import { LeaderboardService } from '@hunt-the-bishomalo/gamestats/data-access';
import {
  GameAchievementsService,
  GameEngineService,
} from '@hunt-the-bishomalo/game/data-access';
import { ACHIEVEMENTS_LIST } from './utils/achievements.const';
import * as Sentry from '@sentry/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ACHIEVEMENTS_LIST_TOKEN, useValue: ACHIEVEMENTS_LIST },
    { provide: GAME_STORE, useExisting: GameStore },
    { provide: ACHIEVEMENT_SERVICE, useExisting: AchievementService },
    {
      provide: GAME_ACHIEVEMENTS_SERVICE,
      useExisting: GameAchievementsService,
    },
    { provide: LEADERBOARD_SERVICE, useExisting: LeaderboardService },
    { provide: GAME_ENGINE_TOKEN, useExisting: GameEngineService },
    {
      provide: APP_INITIALIZER,
      useFactory: (monitoringService: MonitoringService) => () =>
        monitoringService.init(),
      deps: [MonitoringService],
      multi: true,
    },
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler(),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },
    provideAnimations(),
    provideZonelessChangeDetection(),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
      withHashLocation(),
    ),
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ['en', 'es'],
        defaultLang: 'es',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
