import { effect, inject, Injectable } from '@angular/core';
import { ScoreEntry } from 'src/app/models';
import { LocalstorageService } from '../localstorage/localstorage.service';
import { AchievementService } from '../achievement/achievement.service';
import { GameStore } from 'src/app/store';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private readonly storageKey = 'hunt_the_bishomalo_leaderboard';
  _leaderboard: ScoreEntry[] = [];

  private readonly gameStore = inject(GameStore);
  private readonly gameAchieve = inject(AchievementService);
  private readonly _hunter = this.gameStore.hunter;
  private readonly _settings = this.gameStore.settings;

  private countSteps = 0;

  constructor(private readonly localStorageService: LocalstorageService) {
    const stored = this.loadLeaderboardFromStorage();
    this._leaderboard = stored;
    effect(() => {
      const { x, y, hasWon, alive, wumpusKilled } = this._hunter();
      if (x || y) this.countSteps += 1;
      if (hasWon || !alive) {
        const { player, blackout, size } = this._settings();
        const endTime = new Date();
        const seconds = this.calculateElapsedSeconds(endTime);
        this.addEntry({
          playerName: player,
          timeInSeconds: seconds,
          date: endTime,
          level: size - 4 + 1,
          blackout: !!blackout,
          wumpusKilled,
          steps: this.countSteps,
          deads: alive ? 0 : 1,
        });
        this.countSteps = 0;

        if (hasWon) this.gameAchieve.caclVictoryAchieve(seconds);
      }
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

  //TODO arreglar esta chapuza
  private calculateElapsedSeconds(endTime: Date): number {
    const startime = this.gameStore.getStartTime()();
    return startime ? Math.round((endTime.getTime() - startime.getTime()) / 1000) : 0;
  }
}
