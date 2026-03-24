import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './transloco-loader';
import {
  GAME_STORE_TOKEN,
  GAME_SOUND_TOKEN,
  ANALYTICS_SERVICE_TOKEN,
  LOCALSTORAGE_SERVICE_TOKEN,
} from '@hunt-the-bishomalo/core/api';
import { GAME_ENGINE_TOKEN } from '@hunt-the-bishomalo/game/api';

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
    {
      provide: GAME_STORE_TOKEN,
      useValue: {
        gold: () => 0,
        inventory: () => [],
        settings: () => ({ difficulty: { maxChance: 0.5, maxLives: 3 } }),
        lives: () => 3,
        updateHunter: () => {},
        updateGame: () => {},
      },
    },
    {
        provide: GAME_ENGINE_TOKEN,
        useValue: {
            nextLevel: () => {},
        }
    },
    {
      provide: GAME_SOUND_TOKEN,
      useValue: {
        stop: () => {},
        playSound: () => {},
      },
    },
    {
      provide: ANALYTICS_SERVICE_TOKEN,
      useValue: {
        trackAchievementUnlocked: () => {},
      },
    },
    {
      provide: LOCALSTORAGE_SERVICE_TOKEN,
      useValue: {
        getValue: () => [],
        setValue: () => {},
      },
    },
  ],
};
