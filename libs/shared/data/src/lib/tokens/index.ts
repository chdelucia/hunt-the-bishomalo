import { InjectionToken } from '@angular/core';
import { IAchievementService } from '../interfaces/achievement-service.interface';
import { ILeaderboardService } from '../interfaces/leaderboard-service.interface';

export const ACHIEVEMENT_SERVICE = new InjectionToken<IAchievementService>('ACHIEVEMENT_SERVICE');

export const LEADERBOARD_SERVICE = new InjectionToken<ILeaderboardService>('LEADERBOARD_SERVICE');
