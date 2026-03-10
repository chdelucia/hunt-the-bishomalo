import { InjectionToken } from '@angular/core';
import { ILeaderboardService } from '../interfaces/leaderboard-service.interface';

export const LEADERBOARD_SERVICE = new InjectionToken<ILeaderboardService>('LEADERBOARD_SERVICE');
