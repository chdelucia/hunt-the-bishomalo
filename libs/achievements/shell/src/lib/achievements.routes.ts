import { Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { AchievementService } from '@hunt-the-bishomalo/achievements/data-access';
import {
  ANALYTICS_SERVICE_TOKEN,
  AnalyticsService,
  LOCALSTORAGE_SERVICE_TOKEN,
  LocalstorageService,
} from '@hunt-the-bishomalo/achievements/data-access';

export const achievementsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@hunt-the-bishomalo/achievements/feature').then((m) => m.AchievementsComponent),
    providers: [
      provideHttpClient(),
      { provide: ACHIEVEMENT_SERVICE, useClass: AchievementService },
      { provide: ANALYTICS_SERVICE_TOKEN, useClass: AnalyticsService },
      { provide: LOCALSTORAGE_SERVICE_TOKEN, useClass: LocalstorageService },
    ],
  },
];
