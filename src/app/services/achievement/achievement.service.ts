import { effect, inject, Injectable, signal } from '@angular/core';
import { Achievement, AchieveTypes, Cell, GameSound } from 'src/app/models';
import {
  AnalyticsService,
  GameSoundService,
  LocalstorageService,
} from 'src/app/services';
import { ACHIEVEMENTS_LIST } from './achieve.const';
import { GameStore } from 'src/app/store';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  achievements = ACHIEVEMENTS_LIST;
  private readonly storageKey = 'hunt_the_bishomalo_achievements';
  completed = signal<Achievement | undefined>(undefined);

  private readonly gameStore = inject(GameStore);

  constructor(
    private readonly gameSound: GameSoundService,
    private readonly analytics: AnalyticsService,
    private readonly localStoreService: LocalstorageService,
  ) {
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
    if (!this.gameStore.hunterAlive()) {
      if (this.gameStore.blackout()) {
        this.activeAchievement(AchieveTypes.DEATHBYBLACKOUT);
      } else if (this.gameStore.wumpusKilled()) {
        this.activeAchievement(AchieveTypes.LASTBREATH);
      }
    }
  }

  private updateLocalStorageWithNewId(id: string): void {
    const storedIds = this.getStoredAchievementIds();
    const updatedIds = [...storedIds, id];
    this.localStoreService.setValue<string[]>(this.storageKey, updatedIds);
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

  activeAchievement(id: AchieveTypes): void {
    const achieve = this.achievements.find((item) => item.id === id);
    if (achieve && !achieve.unlocked) {
      achieve.unlocked = true;
      this.completed.set(achieve);

      this.updateLocalStorageWithNewId(id);
      this.analytics.trackAchievementUnlocked(id, achieve.title);
    }
  }

  caclVictoryAchieve(seconds: number): void {
    const { arrows, wumpusKilled } = this.gameStore.hunter();
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
    else if (y === cell.y) return Math.abs(x - cell.x);
    return 0;
  }

  private countVisitedCells(): number {
    const board = this.gameStore.board();
    let count = 0;

    for (const row of board) {
      for (const cell of row) {
        if (cell.visited) {
          count++;
        }
      }
    }

    return count;
  }

  private cartographyAchieve(): void {
    const visited = this.countVisitedCells();
    const { size, pits } = this.gameStore.settings();

    if (size * size - pits === visited) {
      this.activeAchievement(AchieveTypes.EXPERTCARTO);
    }

    if (visited > size * size * 0.5) {
      this.activeAchievement(AchieveTypes.NOVICECARTO);
    }
  }

  private isAllCompleted(): void {
    const victory = this.achievements.filter((x) => x.unlocked);

    if (this.achievements.length - victory.length <= 1) {
      this.activeAchievement(AchieveTypes.FINAL);
      this.gameSound.stop();
      this.gameSound.playSound(GameSound.FF7, false);
    }
  }
}
