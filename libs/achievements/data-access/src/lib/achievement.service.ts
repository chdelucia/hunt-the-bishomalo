import { inject, Injectable, signal } from '@angular/core';
import { Achievement, AchieveTypes, GameSound } from '@hunt-the-bishomalo/data';
import {
  AnalyticsService,
  GameSoundService,
  LocalstorageService
} from '@hunt-the-bishomalo/core/services';
import { IAchievementService, ACHIEVEMENTS_LIST_TOKEN } from '@hunt-the-bishomalo/achievements/api';

@Injectable({
  providedIn: 'root',
})
export class AchievementService implements IAchievementService {
  private readonly _achievementsList = inject(ACHIEVEMENTS_LIST_TOKEN);
  readonly achievements = this._achievementsList.map((ach) => ({ ...ach }));
  private readonly storageKey = 'hunt_the_bishomalo_achievements';
  readonly completed = signal<Achievement | undefined>(undefined);

  private readonly gameSound = inject(GameSoundService);
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


  isAllCompleted(): void {
    const victory = this.achievements.filter((x) => x.unlocked);
    if (this.achievements.length - victory.length <= 1) {
      this.activeAchievement(AchieveTypes.FINAL);
      this.gameSound.stop();
      this.gameSound.playSound(GameSound.FF7, false);
    }
  }
}
