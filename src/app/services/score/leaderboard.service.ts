import { computed, Injectable } from '@angular/core';
import { ScoreEntry } from 'src/app/models';
import { signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private readonly storageKey = 'hunt_the_bishomalo_leaderboard';
  private _leaderboard = signal<ScoreEntry[]>(this.loadLeaderboardFromStorage());
  readonly leaderboard = computed(() => this._leaderboard());

  private loadLeaderboardFromStorage(): ScoreEntry[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  addEntry(entry: ScoreEntry): void {
    const leaderboard = [...this._leaderboard(), entry];
    leaderboard.sort((a, b) => a.timeInSeconds - b.timeInSeconds);
    localStorage.setItem(this.storageKey, JSON.stringify(leaderboard));
    
    this._leaderboard.set(leaderboard);
  }

  clear(): void {
    localStorage.removeItem(this.storageKey);
    this._leaderboard.set([]);
  }
}
