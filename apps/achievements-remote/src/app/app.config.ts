import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './transloco-loader';
import { AchievementService, ANALYTICS_SERVICE_TOKEN, LOCALSTORAGE_SERVICE_TOKEN } from '@hunt-the-bishomalo/achievements/data-access';
import { ACHIEVEMENT_SERVICE, ACHIEVEMENTS_LIST_TOKEN } from '@hunt-the-bishomalo/achievements/api';
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
        stop: () => undefined,
        playSound: () => undefined,
      },
    },
    {
      provide: ANALYTICS_SERVICE_TOKEN,
      useValue: {
        trackAchievementUnlocked: () => undefined,
      },
    },
    {
      provide: LOCALSTORAGE_SERVICE_TOKEN,
      useValue: {
        getValue: () => [],
        setValue: () => undefined,
      },
    },
  ],
};
