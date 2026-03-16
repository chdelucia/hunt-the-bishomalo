import { InjectionToken } from '@angular/core';

export interface ILeaderboardService {
  clear: () => void;
}

export const LEADERBOARD_SERVICE = new InjectionToken<ILeaderboardService>('LEADERBOARD_SERVICE');
