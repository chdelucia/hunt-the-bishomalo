import { Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { AchievementService } from '../data-access/index';
import {
  ANALYTICS_SERVICE_TOKEN,
  LOCALSTORAGE_SERVICE_TOKEN,
} from '@hunt-the-bishomalo/core/api';
import {
  AnalyticsService,
  LocalstorageService,
} from '@hunt-the-bishomalo/core/data-access';

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
