import { inject, Injectable, signal } from '@angular/core';
import { Achievement, AchieveTypes } from '@hunt-the-bishomalo/data';
import {
  AnalyticsService,
  LocalstorageService
} from '@hunt-the-bishomalo/core/services';
import { ACHIEVEMENTS_LIST_TOKEN, IAchievementService } from '@hunt-the-bishomalo/achievements/api';

@Injectable({
  providedIn: 'root',
})
export class AchievementService implements IAchievementService {
  private readonly initialAchievements = inject(ACHIEVEMENTS_LIST_TOKEN);
  readonly achievements = this.initialAchievements.map((ach) => ({ ...ach }));
  private readonly storageKey = 'hunt_the_bishomalo_achievements';
  readonly completed = signal<Achievement | undefined>(undefined);

  private readonly analytics = inject(AnalyticsService);
  private readonly localStoreService = inject(LocalstorageService);

  constructor() {
    this.syncAchievementsWithStorage();
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
}
