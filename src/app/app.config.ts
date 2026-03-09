import { ApplicationConfig, provideZonelessChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { TranslocoHttpLoader } from './utils/transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import { GAME_STORE } from '@hunt-the-bishomalo/story';
import { GameStore } from '@hunt-the-bishomalo/core/store';
import { LEADERBOARD_SERVICE } from '@hunt-the-bishomalo/data';
import { LeaderboardService } from '@hunt-the-bishomalo/gamestats';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: GAME_STORE, useExisting: GameStore },
    { provide: LEADERBOARD_SERVICE, useExisting: LeaderboardService },
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
