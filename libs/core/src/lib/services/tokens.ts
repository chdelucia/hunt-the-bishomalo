import { InjectionToken } from '@angular/core';
import { IAchievementService, ILeaderboardService } from '@hunt-the-bishomalo/data';

export const ACHIEVEMENT_SERVICE = new InjectionToken<IAchievementService>('ACHIEVEMENT_SERVICE');

export const LEADERBOARD_SERVICE = new InjectionToken<ILeaderboardService>('LEADERBOARD_SERVICE');
