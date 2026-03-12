import { effect, inject, Injectable } from '@angular/core';
import { ScoreEntry } from '@hunt-the-bishomalo/data';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { LocalstorageService } from '@hunt-the-bishomalo/core';
import { GameStore } from '@hunt-the-bishomalo/game/api';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private readonly storageKey = 'hunt_the_bishomalo_leaderboard';
  _leaderboard: ScoreEntry[] = [];

  private readonly gameStore = inject(GameStore);
  private readonly gameAchieve = inject(ACHIEVEMENT_SERVICE);
  private readonly localStorageService = inject(LocalstorageService);
  private readonly _hunter = this.gameStore.hunter;
  private readonly _settings = this.gameStore.settings;

  private countSteps = 0;

  constructor() {
    this._leaderboard = this.loadLeaderboardFromStorage();
    effect(() => {
      if (this.gameStore.hasWon() || !this.gameStore.isAlive()) {
        const { player, blackout, size } = this._settings();
        const endTime = new Date();
        const seconds = this.calculateElapsedSeconds(endTime);
        this.addEntry({
          playerName: player,
          timeInSeconds: seconds,
          date: endTime,
          level: size - 4 + 1,
          blackout: !!blackout,
          wumpusKilled: this.gameStore.wumpusKilled(),
          steps: this.countSteps,
          deads: this.gameStore.isAlive() ? 0 : 1,
        });
        this.countSteps = 0;
        if (this.gameStore.hasWon()) this.gameAchieve.calcVictoryAchieve(seconds);
      }
    });
    effect(() => {
      const { x, y } = this._hunter();
      if (x || y) this.countSteps += 1;
    });
  }

  private loadLeaderboardFromStorage(): ScoreEntry[] {
    const raw = this.localStorageService.getValue<ScoreEntry[]>(this.storageKey);
    return raw ?? [];
  }

  private addEntry(entry: ScoreEntry): void {
    this._leaderboard.push(entry);
    this.localStorageService.setValue<ScoreEntry[]>(this.storageKey, this._leaderboard);
  }

  clear(): void {
    this.localStorageService.clearValue(this.storageKey);
    this._leaderboard = [];
  }

  private calculateElapsedSeconds(endTime: Date): number {
    const startime = new Date(this.gameStore.startTime());
    return startime ? Math.round((endTime.getTime() - startime.getTime()) / 1000) : 0;
  }
}
