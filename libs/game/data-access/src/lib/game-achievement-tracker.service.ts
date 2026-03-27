import { inject, Injectable } from '@angular/core';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { IGameAchievementTracker } from '@hunt-the-bishomalo/game/api';
import { Cell, AchieveTypes } from '@hunt-the-bishomalo/shared-data';

@Injectable({ providedIn: 'root' })
export class GameAchievementTrackerService implements IGameAchievementTracker {
  private readonly store = inject(GAME_STORE_TOKEN);
  private readonly achieve = inject(ACHIEVEMENT_SERVICE);

  calcVictoryAchieve(seconds: number): void {
    const wumpusKilled = this.store.wumpusKilled();
    const { arrows } = this.store.hunter();
    const { blackout, size } = this.store.settings();

    if (blackout) this.achieve.activeAchievement(AchieveTypes.WINBLACKWOUT);
    if (arrows > 1 && !wumpusKilled) this.achieve.activeAchievement(AchieveTypes.WASTEDARROWS);
    else {
      if (size >= 12) this.achieve.activeAchievement(AchieveTypes.WINLARGEMAP);
      if (seconds <= 10) this.achieve.activeAchievement(AchieveTypes.SPEEDRUNNER);
      if (!wumpusKilled) this.achieve.activeAchievement(AchieveTypes.WRAT);
      if (wumpusKilled) this.achieve.activeAchievement(AchieveTypes.WINHERO);
      this.cartographyAchieve();
    }
    this.achieve.isAllCompleted();
  }

  handleWumpusKillAchieve(cell: Cell): void {
    const { blackout } = this.store.settings();
    const distance = this.calcDistance(cell);
    if (blackout) this.achieve.activeAchievement(AchieveTypes.BLINDWUMPUSKILLED);
    else if (distance > 3) this.achieve.activeAchievement(AchieveTypes.SNIPER);
    else if (distance === 1) this.achieve.activeAchievement(AchieveTypes.DEATHDUEL);
    else this.achieve.activeAchievement(AchieveTypes.WUMPUSKILLED);
  }

  activeAchievement(id: AchieveTypes | string): void {
    this.achieve.activeAchievement(id);
  }

  private calcDistance(cell: Cell): number {
    const { x, y } = this.store.hunter();
    if (x === cell.x) return Math.abs(y - cell.y);
    if (y === cell.y) return Math.abs(x - cell.x);
    return 0;
  }

  private cartographyAchieve(): void {
    const visited = this.countVisitedCells();
    const { size, pits } = this.store.settings();
    if (size * size - pits === visited) this.achieve.activeAchievement(AchieveTypes.EXPERTCARTO);
    if (visited > size * size * 0.5) this.achieve.activeAchievement(AchieveTypes.NOVICECARTO);
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
