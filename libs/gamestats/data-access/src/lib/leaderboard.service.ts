import { inject, Injectable } from '@angular/core';
import { ScoreEntry } from '@hunt-the-bishomalo/shared-data';
import { LOCALSTORAGE_SERVICE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { ILeaderboardService } from '@hunt-the-bishomalo/gamestats/api';

@Injectable({ providedIn: 'root' })
export class LeaderboardService implements ILeaderboardService {
  private readonly storageKey = 'hunt_the_bishomalo_leaderboard';
  leaderboard: ScoreEntry[] = [];

  private readonly localStorageService = inject(LOCALSTORAGE_SERVICE_TOKEN);

  constructor() {
    this.leaderboard = this.loadLeaderboardFromStorage();
  }

  private loadLeaderboardFromStorage(): ScoreEntry[] {
    const raw = this.localStorageService.getValue<ScoreEntry[]>(this.storageKey);
    return raw ?? [];
  }

  addEntry(entry: ScoreEntry): void {
    this.leaderboard.push(entry);
    this.localStorageService.setValue<ScoreEntry[]>(this.storageKey, this.leaderboard);
  }

  clear(): void {
    this.localStorageService.clearValue(this.storageKey);
    this.leaderboard = [];
  }
}
