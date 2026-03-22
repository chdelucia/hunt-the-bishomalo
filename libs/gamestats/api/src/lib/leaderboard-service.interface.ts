import { InjectionToken } from '@angular/core';
import { ScoreEntry } from '@hunt-the-bishomalo/data';

export interface ILeaderboardService {
  readonly leaderboard: ScoreEntry[];
  addEntry: (entry: ScoreEntry) => void;
  clear: () => void;
}

export const LEADERBOARD_SERVICE = new InjectionToken<ILeaderboardService>('LEADERBOARD_SERVICE');
