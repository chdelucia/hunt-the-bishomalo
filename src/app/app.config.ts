import {
  ApplicationConfig,
  provideZonelessChangeDetection,
  isDevMode,
  APP_INITIALIZER,
  ErrorHandler,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withHashLocation, withInMemoryScrolling, Router } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { TranslocoHttpLoader } from './utils/transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import { GameStore } from '@hunt-the-bishomalo/core/data-access';
import {
  MonitoringService,
  GameSoundService,
  LocalstorageService,
  AnalyticsService,
  GameEventService,
  RemoteConfig,
  REMOTE_CONFIG_TOKEN,
} from '@hunt-the-bishomalo/core/data-access';
import {
  GAME_STORE_TOKEN,
  GAME_SOUND_TOKEN,
  LOCALSTORAGE_SERVICE_TOKEN,
  ANALYTICS_SERVICE_TOKEN,
  GAME_EVENT_SERVICE_TOKEN,
} from '@hunt-the-bishomalo/core/api';
import { ACHIEVEMENT_SERVICE, ACHIEVEMENTS_LIST_TOKEN, ACHIEVEMENTS_LIST } from '@hunt-the-bishomalo/achievements/api';
import { GAME_ENGINE_TOKEN } from '@hunt-the-bishomalo/game/api';
import { LEADERBOARD_SERVICE } from '@hunt-the-bishomalo/gamestats/api';
import { LeaderboardService } from '@hunt-the-bishomalo/gamestats/data-access';
import { GameEngineService } from '@hunt-the-bishomalo/game/data-access';
import * as Sentry from '@sentry/angular';

// Achievements implementation is in the remote, but we still need it functional in the shell for tracking.
import { Injectable, signal, inject } from '@angular/core';
import { Achievement } from '@hunt-the-bishomalo/shared-data';

@Injectable({ providedIn: 'root' })
class ShellAchievementService {
  private readonly storageKey = 'hunt_the_bishomalo_achievements';
  private readonly _achievementsList = inject(ACHIEVEMENTS_LIST_TOKEN);
  readonly achievements: Achievement[] = this._achievementsList;
  readonly completed = signal<Achievement | undefined>(undefined);
  private readonly localStoreService = inject(LOCALSTORAGE_SERVICE_TOKEN);
  private readonly analytics = inject(ANALYTICS_SERVICE_TOKEN);

  activeAchievement(id: string): void {
    const storedIds = this.localStoreService.getValue<string[]>(this.storageKey) || [];
    if (!storedIds.includes(id)) {
      const newIds = [...storedIds, id];
      this.localStoreService.setValue(this.storageKey, newIds);

      const achievement = this.achievements.find((a) => a.id === id);
      if (achievement) {
        this.analytics.trackAchievementUnlocked(id, achievement.title);
        this.completed.set({ ...achievement, unlocked: true });
      } else {
        this.analytics.trackAchievementUnlocked(id, id);
        const dummyAchieve: unknown = {
          id,
          title: id,
          description: '',
          icon: '',
          svgIcon: '',
          rarity: 'common',
          unlocked: true,
        };
        this.completed.set(dummyAchieve as Achievement);
      }

      // Notify other MFEs via CustomEvent
      window.dispatchEvent(new CustomEvent('achievement-unlocked', { detail: { id } }));
    }
  }
  isAllCompleted(): void {
    // Method intentionally left empty.
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: GAME_STORE_TOKEN, useExisting: GameStore },
    { provide: GAME_SOUND_TOKEN, useExisting: GameSoundService },
    { provide: LOCALSTORAGE_SERVICE_TOKEN, useExisting: LocalstorageService },
    { provide: ANALYTICS_SERVICE_TOKEN, useExisting: AnalyticsService },
    { provide: GAME_EVENT_SERVICE_TOKEN, useExisting: GameEventService },
    { provide: ACHIEVEMENTS_LIST_TOKEN, useValue: ACHIEVEMENTS_LIST },
    { provide: ACHIEVEMENT_SERVICE, useClass: ShellAchievementService },
    { provide: LEADERBOARD_SERVICE, useClass: LeaderboardService },
    { provide: GAME_ENGINE_TOKEN, useClass: GameEngineService },
    {
      provide: REMOTE_CONFIG_TOKEN,
      useFactory: () => (window as unknown as { _REMOTE_CONFIG: RemoteConfig })._REMOTE_CONFIG,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (monitoringService: MonitoringService) => () => monitoringService.init(),
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
