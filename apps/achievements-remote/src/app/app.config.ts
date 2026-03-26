import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './transloco-loader';
import { AchievementService } from './achievements/data-access/index';
import { ACHIEVEMENT_SERVICE, ACHIEVEMENTS_LIST_TOKEN } from '@hunt-the-bishomalo/achievements/api';
import {
  GAME_SOUND_TOKEN,
  ANALYTICS_SERVICE_TOKEN,
  LOCALSTORAGE_SERVICE_TOKEN,
} from '@hunt-the-bishomalo/core/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
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
    { provide: ACHIEVEMENTS_LIST_TOKEN, useValue: [] },
    { provide: ACHIEVEMENT_SERVICE, useClass: AchievementService },
    {
      provide: GAME_SOUND_TOKEN,
      useValue: {
        stop: () => {
          /* Method intentionally left empty. */
        },
        playSound: () => {
          /* Method intentionally left empty. */
        },
      },
    },
    {
      provide: ANALYTICS_SERVICE_TOKEN,
      useValue: {
        trackAchievementUnlocked: () => {
          /* Method intentionally left empty. */
        },
      },
    },
    {
      provide: LOCALSTORAGE_SERVICE_TOKEN,
      useValue: {
        getValue: () => [],
        setValue: () => {
          /* Method intentionally left empty. */
        },
      },
    },
  ],
};
