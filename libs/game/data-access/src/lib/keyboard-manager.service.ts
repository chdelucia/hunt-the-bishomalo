import { inject, Injectable, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { GAME_ENGINE_TOKEN, GAME_ACHIEVEMENT_TRACKER_TOKEN } from '@hunt-the-bishomalo/game/api';
import { AchieveTypes, RouteTypes } from '@hunt-the-bishomalo/shared-data';

@Injectable({ providedIn: 'root' })
export class KeyboardManagerService {
  private readonly game = inject(GAME_ENGINE_TOKEN);
  private readonly achievementTracker = inject(GAME_ACHIEVEMENT_TRACKER_TOKEN);
  private readonly router = inject(Router);

  handleKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (target?.tagName && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
      return;
    }

    const action = this.keyActionMap[event.code];
    if (action) {
      event.preventDefault();
      action();
    }
  }

  private readonly keyActionMap: Record<string, () => void> = {
    ArrowUp: () => this.game.moveForward(),
    Space: () => this.game.shootArrow(),
    ArrowLeft: () => this.game.turnLeft(),
    ArrowRight: () => this.game.turnRight(),
    Enter: () => this.game.shootArrow(),
    KeyR: () => {
      if (isDevMode()) this.game.initGame();
    },
    KeyW: () => {
      this.game.moveForward();
      this.achievementTracker.activeAchievement(AchieveTypes.GAMER);
    },
    KeyA: () => {
      this.game.turnLeft();
      this.achievementTracker.activeAchievement(AchieveTypes.GAMER);
    },
    KeyD: () => {
      this.game.turnRight();
      this.achievementTracker.activeAchievement(AchieveTypes.GAMER);
    },
    KeyN: () => {
      this.game.newGame();
    },
    KeyI: () => {
      this.router.navigate([RouteTypes.RULES]);
    },
  };
}
