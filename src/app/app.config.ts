import { ApplicationConfig, provideZonelessChangeDetection, isDevMode } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { TranslocoHttpLoader } from './utils/transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import { GAME_STORE } from '@hunt-the-bishomalo/story/api';
import { GameStore } from '@hunt-the-bishomalo/core/store';
import { LEADERBOARD_SERVICE } from '@hunt-the-bishomalo/data';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { AchievementService } from '@hunt-the-bishomalo/achievements/data-access';
import { LeaderboardService } from '@hunt-the-bishomalo/gamestats/data-access';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: GAME_STORE, useExisting: GameStore },
    { provide: ACHIEVEMENT_SERVICE, useExisting: AchievementService },
    { provide: LEADERBOARD_SERVICE, useExisting: LeaderboardService },
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
