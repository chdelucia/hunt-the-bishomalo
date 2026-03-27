import { inject, Injectable } from '@angular/core';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { AchieveTypes, Cell } from '@hunt-the-bishomalo/shared-data';

@Injectable({ providedIn: 'root' })
export class GameAchievementTrackerService {
  private readonly achieve = inject(ACHIEVEMENT_SERVICE);
  private readonly store = inject(GAME_STORE_TOKEN);

  public calcVictoryAchieve(seconds: number): void {
    const wumpusKilled = this.store.wumpusKilled();
    const hunter = this.store.hunter();
    const settings = this.store.settings();

    if (settings.blackout) {
      this.achieve.activeAchievement(AchieveTypes.WINBLACKWOUT);
    }

    if (hunter.arrows > 1 && !wumpusKilled) {
      this.achieve.activeAchievement(AchieveTypes.WASTEDARROWS);
    } else {
      if (settings.size >= 12) {
        this.achieve.activeAchievement(AchieveTypes.WINLARGEMAP);
      }
      if (seconds <= 10) {
        this.achieve.activeAchievement(AchieveTypes.SPEEDRUNNER);
      }
      if (!wumpusKilled) {
        this.achieve.activeAchievement(AchieveTypes.WRAT);
      }
      if (wumpusKilled) {
        this.achieve.activeAchievement(AchieveTypes.WINHERO);
      }
      this.cartographyAchieve();
    }
    this.achieve.isAllCompleted();
  }

  public handleWumpusKillAchieve(cell: Cell): void {
    const settings = this.store.settings();
    const distance = this.calcDistance(cell);

    if (settings.blackout) {
      this.achieve.activeAchievement(AchieveTypes.BLINDWUMPUSKILLED);
    } else if (distance > 3) {
      this.achieve.activeAchievement(AchieveTypes.SNIPER);
    } else if (distance === 1) {
      this.achieve.activeAchievement(AchieveTypes.DEATHDUEL);
    } else {
      this.achieve.activeAchievement(AchieveTypes.WUMPUSKILLED);
    }
  }

  public handleWallHitAchieve(): void {
    this.achieve.activeAchievement(AchieveTypes.HARDHEAD);
  }

  public handleMissedArrowAchieve(): void {
    this.achieve.activeAchievement(AchieveTypes.MISSEDSHOT);
  }

  private calcDistance(cell: Cell): number {
    const hunter = this.store.hunter();
    if (hunter.x === cell.x) return Math.abs(hunter.y - cell.y);
    if (hunter.y === cell.y) return Math.abs(hunter.x - cell.x);
    return 0;
  }

  private cartographyAchieve(): void {
    const visited = this.countVisitedCells();
    const settings = this.store.settings();
    if (settings.size * settings.size - settings.pits === visited) {
      this.achieve.activeAchievement(AchieveTypes.EXPERTCARTO);
    }
    if (visited > settings.size * settings.size * 0.5) {
      this.achieve.activeAchievement(AchieveTypes.NOVICECARTO);
    }
  }

  private countVisitedCells(): number {
    const board = this.store.board();
    let count = 0;
    for (const row of board) {
      for (const cell of row) {
        if (cell.visited) count++;
      }
    }
    return count;
  }
}
