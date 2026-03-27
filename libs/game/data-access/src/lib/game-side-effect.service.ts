import { effect, inject, Injectable } from '@angular/core';
import { GAME_STORE_TOKEN, GAME_SOUND_TOKEN } from '@hunt-the-bishomalo/core/api';
import {
  GAME_ACHIEVEMENT_TRACKER_TOKEN,
  GAME_STATS_TRACKER_TOKEN,
  IGameSideEffect,
} from '@hunt-the-bishomalo/game/api';
import { GameSound, AchieveTypes } from '@hunt-the-bishomalo/shared-data';

@Injectable({ providedIn: 'root' })
export class GameSideEffectService implements IGameSideEffect {
  readonly brand = 'IGameSideEffect';
  private readonly store = inject(GAME_STORE_TOKEN);
  private readonly sound = inject(GAME_SOUND_TOKEN);
  private readonly achievementTracker = inject(GAME_ACHIEVEMENT_TRACKER_TOKEN);
  private readonly statsTracker = inject(GAME_STATS_TRACKER_TOKEN);

  constructor() {
    effect(() => this.statsTracker.trackSteps());
    effect(() => this.statsTracker.handleGameOver());
    effect(() => this.handleBlackoutAchievement());
    effect(() => this.handlePentaAchievement());
    effect(() => this.handleDeathAchievements());
  }

  private handleBlackoutAchievement(): void {
    const isAlive = this.store.isAlive();
    const hasWon = this.store.hasWon();
    const settings = this.store.settings();

    if (settings?.blackout && isAlive && !hasWon) {
      this.sound.playSound(GameSound.BLACKOUT, false);
      this.achievementTracker.activeAchievement(AchieveTypes.BLACKOUT);
    }
  }

  private handlePentaAchievement(): void {
    if (this.store.wumpusKilled() === 5) {
      this.achievementTracker.activeAchievement(AchieveTypes.PENTA);
      this.sound.playSound(GameSound.PENTA, false);
    }
  }

  private handleDeathAchievements(): void {
    if (!this.store.isAlive()) {
      const achievement = this.store.blackout()
        ? AchieveTypes.DEATHBYBLACKOUT
        : AchieveTypes.LASTBREATH;
      this.achievementTracker.activeAchievement(achievement);
    }
  }
}
