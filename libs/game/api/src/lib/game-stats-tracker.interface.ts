import { InjectionToken } from '@angular/core';

export interface IGameStatsTracker {
  trackSteps(): void;
  handleGameOver(): void;
  resetSteps(): void;
}

export const GAME_STATS_TRACKER_TOKEN = new InjectionToken<IGameStatsTracker>('GAME_STATS_TRACKER_TOKEN');
