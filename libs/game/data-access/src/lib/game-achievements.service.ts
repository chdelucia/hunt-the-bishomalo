import { effect, inject, Injectable } from '@angular/core';
import { AchieveTypes, Cell, GameSound } from '@hunt-the-bishomalo/data';
import { GameSoundService } from '@hunt-the-bishomalo/core/services';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { GameStore } from '@hunt-the-bishomalo/core/store';
import { IGameAchievementsService } from '@hunt-the-bishomalo/game/api';

@Injectable({
  providedIn: 'root',
})
export class GameAchievementsService implements IGameAchievementsService {
  private readonly gameStore = inject(GameStore);
  private readonly gameSound = inject(GameSoundService);
  private readonly achieveService = inject(ACHIEVEMENT_SERVICE);

  constructor() {
    effect(() => this.checkPentaKillAchievement());
    effect(() => this.checkDeathRelatedAchievements());
  }

  private checkPentaKillAchievement(): void {
    if (this.gameStore.wumpusKilled() === 5) {
      this.achieveService.activeAchievement(AchieveTypes.PENTA);
      this.gameSound.playSound(GameSound.PENTA, false);
    }
  }

  private checkDeathRelatedAchievements(): void {
    if (this.gameStore.isAlive()) return;
    const achievement = this.gameStore.blackout()
      ? AchieveTypes.DEATHBYBLACKOUT
      : AchieveTypes.LASTBREATH;
    this.achieveService.activeAchievement(achievement);
  }

  calcVictoryAchieve(seconds: number): void {
    const wumpusKilled = this.gameStore.wumpusKilled();
    const { arrows } = this.gameStore.hunter();
    const { blackout, size } = this.gameStore.settings();

    if (blackout) this.achieveService.activeAchievement(AchieveTypes.WINBLACKWOUT);
    if (arrows > 1 && !wumpusKilled)
      this.achieveService.activeAchievement(AchieveTypes.WASTEDARROWS);
    else {
      if (size >= 12) this.achieveService.activeAchievement(AchieveTypes.WINLARGEMAP);
      if (seconds <= 10) this.achieveService.activeAchievement(AchieveTypes.SPEEDRUNNER);
      if (!wumpusKilled) this.achieveService.activeAchievement(AchieveTypes.WRAT);
      if (wumpusKilled) this.achieveService.activeAchievement(AchieveTypes.WINHERO);
      this.cartographyAchieve();
    }
    this.isAllCompleted();
  }

  handleWumpusKillAchieve(cell: Cell): void {
    const { blackout } = this.gameStore.settings();
    const distance = this.calcDistance(cell);
    if (blackout) this.achieveService.activeAchievement(AchieveTypes.BLINDWUMPUSKILLED);
    else if (distance > 3) this.achieveService.activeAchievement(AchieveTypes.SNIPER);
    else if (distance === 1) this.achieveService.activeAchievement(AchieveTypes.DEATHDUEL);
    else this.achieveService.activeAchievement(AchieveTypes.WUMPUSKILLED);
  }

  private calcDistance(cell: Cell): number {
    const { x, y } = this.gameStore.hunter();
    if (x === cell.x) return Math.abs(y - cell.y);
    if (y === cell.y) return Math.abs(x - cell.x);
    return 0;
  }

  private countVisitedCells(): number {
    const board = this.gameStore.board();
    let count = 0;
    for (const row of board) {
      for (const cell of row) {
        if (cell.visited) count++;
      }
    }
    return count;
  }

  private cartographyAchieve(): void {
    const visited = this.countVisitedCells();
    const { size, pits } = this.gameStore.settings();
    if (size * size - pits === visited)
      this.achieveService.activeAchievement(AchieveTypes.EXPERTCARTO);
    if (visited > size * size * 0.5)
      this.achieveService.activeAchievement(AchieveTypes.NOVICECARTO);
  }

  activeAchievement(id: AchieveTypes | string): void {
    this.achieveService.activeAchievement(id);
  }

  isAllCompleted(): void {
    const victory = this.achieveService.achievements.filter((x) => x.unlocked);
    if (this.achieveService.achievements.length - victory.length <= 1) {
      this.achieveService.activeAchievement(AchieveTypes.FINAL);
      this.gameSound.stop();
      this.gameSound.playSound(GameSound.FF7, false);
    }
  }
}
