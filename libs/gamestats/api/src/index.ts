import { InjectionToken } from '@angular/core';
import { LeaderboardService } from '@hunt-the-bishomalo/gamestats/data-access';

export const LEADERBOARD_SERVICE_TOKEN = new InjectionToken<LeaderboardService>('LEADERBOARD_SERVICE_TOKEN');

export * from '@hunt-the-bishomalo/gamestats/data-access';
