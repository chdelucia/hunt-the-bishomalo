import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './transloco-loader';
import { AchievementService } from './achievements/data-access/index';
import { ACHIEVEMENT_SERVICE, ACHIEVEMENTS_LIST_TOKEN } from './achievements/data-access/achievement-service.interface';
import {
  ANALYTICS_SERVICE_TOKEN,
  LOCALSTORAGE_SERVICE_TOKEN,
} from './achievements/data-access/core-api.model';
import { InjectionToken } from '@angular/core';

export const GAME_SOUND_TOKEN = new InjectionToken<any>('GAME_SOUND_TOKEN');

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
