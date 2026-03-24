import { inject, Injectable, signal } from '@angular/core';
import { Achievement, AchieveTypes, GameSound } from '@hunt-the-bishomalo/shared-data';
import {
  ANALYTICS_SERVICE_TOKEN,
  GAME_SOUND_TOKEN,
  LOCALSTORAGE_SERVICE_TOKEN,
} from '@hunt-the-bishomalo/core/api';
import { IAchievementService, ACHIEVEMENTS_LIST_TOKEN } from '@hunt-the-bishomalo/achievements/api';

@Injectable({
  providedIn: 'root',
})
export class AchievementService implements IAchievementService {
  private readonly _achievementsList = inject(ACHIEVEMENTS_LIST_TOKEN);
  readonly achievements = this._achievementsList.map((ach) => ({ ...ach }));
  private readonly storageKey = 'hunt_the_bishomalo_achievements';
  readonly completed = signal<Achievement | undefined>(undefined);

  private readonly gameSound = inject(GAME_SOUND_TOKEN);
  private readonly analytics = inject(ANALYTICS_SERVICE_TOKEN);
  private readonly localStoreService = inject(LOCALSTORAGE_SERVICE_TOKEN);

  constructor() {
    this.syncAchievementsWithStorage();
    this.listenForExternalAchievements();
  }

  private listenForExternalAchievements(): void {
    window.addEventListener('achievement-unlocked', (event: any) => {
      const id = event.detail?.id;
      if (id) {
        this.activeAchievement(id);
      }
    });
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
