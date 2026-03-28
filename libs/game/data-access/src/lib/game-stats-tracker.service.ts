import { inject, Injectable } from '@angular/core';
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { IGameStatsTracker, GAME_ACHIEVEMENT_TRACKER_TOKEN } from '@hunt-the-bishomalo/game/api';
import { LEADERBOARD_SERVICE } from '@hunt-the-bishomalo/gamestats/api';

@Injectable({ providedIn: 'root' })
export class GameStatsTrackerService implements IGameStatsTracker {
  private readonly store = inject(GAME_STORE_TOKEN);
  private readonly leaderBoard = inject(LEADERBOARD_SERVICE);
  private readonly achievementTracker = inject(GAME_ACHIEVEMENT_TRACKER_TOKEN);

  private countSteps = 0;

  trackSteps(): void {
    const { x, y } = this.store.hunter();
    if (x || y) {
      this.countSteps += 1;
    }
  }

  handleGameOver(): void {
    if (this.store.hasWon() || !this.store.isAlive()) {
      const { player, blackout, size } = this.store.settings();
      const endTime = new Date();
      const seconds = this.calculateElapsedSeconds(endTime);

      this.leaderBoard.addEntry({
        playerName: player,
        timeInSeconds: seconds,
        date: endTime,
        level: size - 4 + 1,
        blackout: !!blackout,
        wumpusKilled: this.store.wumpusKilled(),
        steps: this.countSteps,
        deads: this.store.isAlive() ? 0 : 1,
      });

      if (this.store.hasWon()) {
        this.achievementTracker.calcVictoryAchieve(seconds);
      }
      this.countSteps = 0;
    }
  }

  resetSteps(): void {
    this.countSteps = 0;
  }

  private calculateElapsedSeconds(endTime: Date): number {
    const startTimeStr = this.store.startTime();
    const startTime = new Date(startTimeStr);
    return startTime ? Math.round((endTime.getTime() - startTime.getTime()) / 1000) : 0;
  }
}
