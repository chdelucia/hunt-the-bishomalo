import { inject, Injectable } from '@angular/core';
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { LEADERBOARD_SERVICE } from '@hunt-the-bishomalo/gamestats/api';
import { GameAchievementTrackerService } from './game-achievement-tracker.service';

@Injectable({ providedIn: 'root' })
export class GameStatsTrackerService {
  private readonly store = inject(GAME_STORE_TOKEN);
  private readonly leaderBoard = inject(LEADERBOARD_SERVICE);
  private readonly achievementTracker = inject(GameAchievementTrackerService);

  public handleGameOver(countSteps: number): void {
    if (this.store.hasWon() || !this.store.isAlive()) {
      const settings = this.store.settings();
      const endTime = new Date();
      const seconds = this.calculateElapsedSeconds(endTime);

      this.leaderBoard.addEntry({
        playerName: settings.player,
        timeInSeconds: seconds,
        date: endTime,
        level: settings.size - 4 + 1,
        blackout: !!settings.blackout,
        wumpusKilled: this.store.wumpusKilled(),
        steps: countSteps,
        deads: this.store.isAlive() ? 0 : 1,
      });

      if (this.store.hasWon()) {
        this.achievementTracker.calcVictoryAchieve(seconds);
      }
    }
  }

  public calculateElapsedSeconds(endTime: Date): number {
    const startTimeStr = this.store.startTime();
    const startTime = startTimeStr ? new Date(startTimeStr) : null;
    return startTime ? Math.round((endTime.getTime() - startTime.getTime()) / 1000) : 0;
  }

  public clearStats(): void {
    this.leaderBoard.clear();
  }
}
