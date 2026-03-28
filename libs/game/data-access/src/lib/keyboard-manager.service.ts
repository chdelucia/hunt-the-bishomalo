import { inject, Injectable, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { GameEngineService } from './game-engine.service';
import { AchieveTypes, RouteTypes } from '@hunt-the-bishomalo/shared-data';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';

@Injectable({ providedIn: 'root' })
export class KeyboardManagerService {
  private readonly game = inject(GameEngineService);
  private readonly achieve = inject(ACHIEVEMENT_SERVICE);
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
      this.achieve.activeAchievement(AchieveTypes.GAMER);
    },
    KeyA: () => {
      this.game.turnLeft();
      this.achieve.activeAchievement(AchieveTypes.GAMER);
    },
    KeyD: () => {
      this.game.turnRight();
      this.achieve.activeAchievement(AchieveTypes.GAMER);
    },
    KeyN: () => {
      this.game.newGame();
    },
    KeyI: () => {
      this.router.navigate([RouteTypes.RULES]);
    },
  };
}
