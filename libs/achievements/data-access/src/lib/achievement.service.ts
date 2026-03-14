import { effect, inject, Injectable, signal } from '@angular/core';
import { Cell, GameSound } from '@hunt-the-bishomalo/data';
import {
  AnalyticsService,
  GameSoundService,
  LocalstorageService,
} from '@hunt-the-bishomalo/core/services';
import { GameStore } from '@hunt-the-bishomalo/core/store';
import { ACHIEVEMENTS_LIST } from './achievements.const';
import { Achievement, AchieveTypes, IAchievementService } from '@hunt-the-bishomalo/achievements/api';

@Injectable({
  providedIn: 'root',
})
export class AchievementService implements IAchievementService {
  readonly achievements = ACHIEVEMENTS_LIST.map((ach) => ({ ...ach }));
  private readonly storageKey = 'hunt_the_bishomalo_achievements';
  readonly completed = signal<Achievement | undefined>(undefined);

  private readonly gameStore = inject(GameStore);
  private readonly gameSound = inject(GameSoundService);
  private readonly analytics = inject(AnalyticsService);
  private readonly localStoreService = inject(LocalstorageService);

  constructor() {
    this.syncAchievementsWithStorage();
    effect(() => this.checkPentaKillAchievement());
    effect(() => this.checkDeathRelatedAchievements());
  }

  private checkPentaKillAchievement(): void {
    if (this.gameStore.wumpusKilled() === 5) {
      this.activeAchievement(AchieveTypes.PENTA);
      this.gameSound.playSound(GameSound.PENTA, false);
    }
  }

  private checkDeathRelatedAchievements(): void {
    if (this.gameStore.isAlive()) return;
    const achievement = this.gameStore.blackout()
      ? AchieveTypes.DEATHBYBLACKOUT
      : AchieveTypes.LASTBREATH;
    this.activeAchievement(achievement);
  }

  private updateLocalStorageWithNewId(id: string): void {
    const storedIds = this.getStoredAchievementIds();
    this.localStoreService.setValue<string[]>(this.storageKey, [...storedIds, id]);
  }

  private syncAchievementsWithStorage(): void {
    const storedIds = this.getStoredAchievementIds();
    this.achievements.forEach((achieve) => {
      achieve.unlocked = storedIds.includes(achieve.id);
    });
  }

  private getStoredAchievementIds(): string[] {
    return this.localStoreService.getValue<string[]>(this.storageKey) || [];
  }

  activeAchievement(id: AchieveTypes | string): void {
    const achieve = this.achievements.find((item) => item.id === id);
    if (achieve && !achieve.unlocked) {
      achieve.unlocked = true;
      this.completed.set(achieve);
      this.updateLocalStorageWithNewId(achieve.id);
      this.analytics.trackAchievementUnlocked(achieve.id, achieve.title);
    }
  }

  calcVictoryAchieve(seconds: number): void {
    const wumpusKilled = this.gameStore.wumpusKilled();
    const { arrows } = this.gameStore.hunter();
    const { blackout, size } = this.gameStore.settings();

    if (blackout) this.activeAchievement(AchieveTypes.WINBLACKWOUT);
    if (arrows > 1 && !wumpusKilled) this.activeAchievement(AchieveTypes.WASTEDARROWS);
    else {
      if (size >= 12) this.activeAchievement(AchieveTypes.WINLARGEMAP);
      if (seconds <= 10) this.activeAchievement(AchieveTypes.SPEEDRUNNER);
      if (!wumpusKilled) this.activeAchievement(AchieveTypes.WRAT);
      if (wumpusKilled) this.activeAchievement(AchieveTypes.WINHERO);
      this.cartographyAchieve();
    }
    this.isAllCompleted();
  }

  handleWumpusKillAchieve(cell: Cell): void {
    const { blackout } = this.gameStore.settings();
    const distance = this.calcDistance(cell);
    if (blackout) this.activeAchievement(AchieveTypes.BLINDWUMPUSKILLED);
    else if (distance > 3) this.activeAchievement(AchieveTypes.SNIPER);
    else if (distance === 1) this.activeAchievement(AchieveTypes.DEATHDUEL);
    else this.activeAchievement(AchieveTypes.WUMPUSKILLED);
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
    if (size * size - pits === visited) this.activeAchievement(AchieveTypes.EXPERTCARTO);
    if (visited > size * size * 0.5) this.activeAchievement(AchieveTypes.NOVICECARTO);
  }

  isAllCompleted(): void {
    const victory = this.achievements.filter((x) => x.unlocked);
    if (this.achievements.length - victory.length <= 1) {
      this.activeAchievement(AchieveTypes.FINAL);
      this.gameSound.stop();
      this.gameSound.playSound(GameSound.FF7, false);
    }
  }
}
