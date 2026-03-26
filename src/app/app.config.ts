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
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslocoHttpLoader } from './utils/transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import { GameStore } from '@hunt-the-bishomalo/core/data-access';
import {
  MonitoringService,
  GameSoundService,
  LocalstorageService,
  AnalyticsService,
  GameEventService,
  MiniBusService,
} from '@hunt-the-bishomalo/core/data-access';
import {
  GAME_STORE_TOKEN,
  GAME_SOUND_TOKEN,
  LOCALSTORAGE_SERVICE_TOKEN,
  ANALYTICS_SERVICE_TOKEN,
  GAME_EVENT_SERVICE_TOKEN,
  MINI_BUS_SERVICE_TOKEN,
} from '@hunt-the-bishomalo/core/api';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { GAME_ENGINE_TOKEN } from '@hunt-the-bishomalo/game/api';
import { LEADERBOARD_SERVICE } from '@hunt-the-bishomalo/gamestats/api';
import { LeaderboardService } from '@hunt-the-bishomalo/gamestats/data-access';
import { GameEngineService } from '@hunt-the-bishomalo/game/data-access';
import * as Sentry from '@sentry/angular';

// Achievements implementation is in the remote, but we still need it functional in the shell for tracking.
import { Injectable, signal, inject } from '@angular/core';
import { Achievement, AchieveTypes, GameSound } from '@hunt-the-bishomalo/shared-data';

@Injectable({ providedIn: 'root' })
class ShellAchievementService {
  private readonly storageKey = 'hunt_the_bishomalo_achievements';
  readonly achievements = signal<Achievement[]>([]);
  readonly completed = signal<Achievement | undefined>(undefined);
  private readonly localStoreService = inject(LOCALSTORAGE_SERVICE_TOKEN);
  private readonly analytics = inject(ANALYTICS_SERVICE_TOKEN);
  private readonly miniBus = inject(MINI_BUS_SERVICE_TOKEN);
  private readonly gameSound = inject(GAME_SOUND_TOKEN);
  private readonly http = inject(HttpClient);

  constructor() {
    this.miniBus.listen('ACHIEVEMENTS_CONFIG', (config: { appId: string }) => {
      this.http.get<Achievement[]>(`/assets/achievements/${config.appId}.json`)
        .subscribe({
          next: (data) => {
            this.achievements.set(data);
            this.syncAchievementsWithStorage();
          },
          error: (err) => {
            // eslint-disable-next-line no-console
            console.error('ShellAchievementService error:', err);
          }
        });
    });
  }

  private syncAchievementsWithStorage(): void {
    const storedIds = this.localStoreService.getValue<string[]>(this.storageKey) || [];
    this.achievements.update((list) =>
      list.map((ach) => ({
        ...ach,
        unlocked: storedIds.includes(ach.id),
      })),
    );
  }

  activeAchievement(id: string): void {
    const storedIds = this.localStoreService.getValue<string[]>(this.storageKey) || [];
    if (!storedIds.includes(id)) {
      const newIds = [...storedIds, id];
      this.localStoreService.setValue(this.storageKey, newIds);

      const achievement = this.achievements().find((a) => a.id === id);
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
          svgIcon: `${id}.png`,
          rarity: 'common',
          unlocked: true,
        };
        this.completed.set(dummyAchieve as Achievement);
      }

      // Notify other MFEs via CustomEvent
      window.dispatchEvent(new CustomEvent('achievement-unlocked', { detail: { id } }));
      this.isAllCompleted();
    }
  }

  isAllCompleted(): void {
    const storedIds = this.localStoreService.getValue<string[]>(this.storageKey) || [];
    const achievements = this.achievements();
    if (achievements.length > 0 && achievements.length - storedIds.length <= 1) {
      this.activeAchievement(AchieveTypes.FINAL);
      this.gameSound.stop();
      this.gameSound.playSound(GameSound.FF7, false);
    }
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: GAME_STORE_TOKEN, useExisting: GameStore },
    { provide: GAME_SOUND_TOKEN, useExisting: GameSoundService },
    { provide: LOCALSTORAGE_SERVICE_TOKEN, useExisting: LocalstorageService },
    { provide: ANALYTICS_SERVICE_TOKEN, useExisting: AnalyticsService },
    { provide: GAME_EVENT_SERVICE_TOKEN, useExisting: GameEventService },
    { provide: MINI_BUS_SERVICE_TOKEN, useExisting: MiniBusService },
    { provide: ACHIEVEMENT_SERVICE, useClass: ShellAchievementService },
    { provide: LEADERBOARD_SERVICE, useClass: LeaderboardService },
    { provide: GAME_ENGINE_TOKEN, useClass: GameEngineService },
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
