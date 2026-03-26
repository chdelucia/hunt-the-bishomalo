import { Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ACHIEVEMENT_SERVICE } from '../data-access/achievement-service.interface';
import { AchievementService } from '../data-access/index';
import {
  ANALYTICS_SERVICE_TOKEN,
  AnalyticsService,
  LOCALSTORAGE_SERVICE_TOKEN,
  LocalstorageService,
} from '../data-access/core-api.model';

export const achievementsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../feature/achievements').then((m) => m.AchievementsComponent),
    providers: [
      provideHttpClient(),
      { provide: ACHIEVEMENT_SERVICE, useClass: AchievementService },
      { provide: ANALYTICS_SERVICE_TOKEN, useClass: AnalyticsService },
      { provide: LOCALSTORAGE_SERVICE_TOKEN, useClass: LocalstorageService },
    ],
  },
];
