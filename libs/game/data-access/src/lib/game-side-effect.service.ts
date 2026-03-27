import { effect, inject, Injectable } from '@angular/core';
import { GAME_STORE_TOKEN, GAME_SOUND_TOKEN } from '@hunt-the-bishomalo/core/api';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { AchieveTypes, GameSound } from '@hunt-the-bishomalo/shared-data';

@Injectable({ providedIn: 'root' })
export class GameSideEffectService {
  private readonly game = inject(GAME_STORE_TOKEN);
  private readonly achieve = inject(ACHIEVEMENT_SERVICE);
  private readonly sound = inject(GAME_SOUND_TOKEN);

  public initSideEffects(): void {
    effect(() => {
      const isAlive = this.game.isAlive();
      const hasWon = this.game.hasWon();
      const settings = this.game.settings();

      if (settings?.blackout && isAlive && !hasWon) {
        this.sound.playSound(GameSound.BLACKOUT, false);
        this.achieve.activeAchievement(AchieveTypes.BLACKOUT);
      }
    });

    effect(() => {
      if (this.game.wumpusKilled() === 5) {
        this.achieve.activeAchievement(AchieveTypes.PENTA);
        this.sound.playSound(GameSound.PENTA, false);
      }
    });

    effect(() => {
      if (!this.game.isAlive()) {
        const achievement = this.game.blackout()
          ? AchieveTypes.DEATHBYBLACKOUT
          : AchieveTypes.LASTBREATH;
        this.achieve.activeAchievement(achievement);
      }
    });
  }
}
