import { computed, Injectable, signal } from '@angular/core';
import { ScoreEntry } from 'src/app/models';
import { LocalstorageService } from '../localstorage/localstorage.service';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private readonly storageKey = 'hunt_the_bishomalo_leaderboard';
  private readonly _leaderboard = signal<ScoreEntry[]>([]);
  readonly leaderboard = computed(() => this._leaderboard());

  constructor(private readonly localStorageService: LocalstorageService) {
    const stored = this.loadLeaderboardFromStorage();
    this._leaderboard.set(stored);
  }

  private loadLeaderboardFromStorage(): ScoreEntry[] {
    const raw = this.localStorageService.getValue<ScoreEntry[]>(this.storageKey);
    return raw ?? [];
  }

  addEntry(entry: ScoreEntry): void {
    const leaderboard = [...this._leaderboard(), entry];
    leaderboard.sort((a, b) => a.timeInSeconds - b.timeInSeconds);
    this.localStorageService.setValue<ScoreEntry[]>(this.storageKey, leaderboard);

    this._leaderboard.set(leaderboard);
  }

  clear(): void {
    this.localStorageService.clearValue(this.storageKey);
    this._leaderboard.set([]);
  }
}
