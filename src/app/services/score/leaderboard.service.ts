import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { ScoreEntry } from 'src/app/models';
import { LocalstorageService } from '../localstorage/localstorage.service';
import { GameStoreService } from '../store/game-store.service';
import { AchievementService } from '../achievement/achievement.service';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private readonly storageKey = 'hunt_the_bishomalo_leaderboard';
  readonly _leaderboard: ScoreEntry[] = [];

  private readonly gameStore = inject(GameStoreService);
  private readonly gameAchieve = inject(AchievementService);
  private _hunter = this.gameStore.hunter;
  private _settings = this.gameStore.settings;

  private countSteps = 0;
  private gold = 0;
  private dieByPit = 0;
  private dieByWumpus = 0;

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
  }

  private calculateElapsedSeconds(endTime: Date): number {
    const startime = this.gameStore.startTime;
    return startime ? Math.round((endTime.getTime() - startime.getTime()) / 1000) : 0;
  }
}
