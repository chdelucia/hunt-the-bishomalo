import { Injectable, signal, inject } from '@angular/core';
import { Achievement } from '@hunt-the-bishomalo/shared-data';
import {
  IAchievementService,
  ACHIEVEMENTS_LIST_TOKEN,
  LOCALSTORAGE_SERVICE_TOKEN,
  ANALYTICS_SERVICE_TOKEN,
} from '@hunt-the-bishomalo/core/api';

@Injectable({ providedIn: 'root' })
export class ShellAchievementService implements IAchievementService {
  private readonly storageKey = 'hunt_the_bishomalo_achievements';
  private readonly _achievementsList = inject(ACHIEVEMENTS_LIST_TOKEN);
  readonly achievements: Achievement[] = this._achievementsList;
  readonly completed = signal<Achievement | undefined>(undefined);
  private readonly localStoreService = inject(LOCALSTORAGE_SERVICE_TOKEN);
  private readonly analytics = inject(ANALYTICS_SERVICE_TOKEN);

  constructor() {
    this.listenForExternalAchievements();
  }

  private listenForExternalAchievements(): void {
    window.addEventListener('achievement-unlocked', (event: Event) => {
      const customEvent = event as CustomEvent;
      const id = customEvent.detail?.id;
      if (id) {
        this.unlockLocally(id);
      }
    });
  }

  activeAchievement(id: string): void {
    const isUnlocked = this.unlockLocally(id);
    if (isUnlocked) {
      // Notify other MFEs via CustomEvent
      window.dispatchEvent(new CustomEvent('achievement-unlocked', { detail: { id } }));
    }
  }

  private unlockLocally(id: string): boolean {
    const storedIds = this.localStoreService.getValue<string[]>(this.storageKey) || [];
    if (!storedIds.includes(id)) {
      const newIds = [...storedIds, id];
      this.localStoreService.setValue(this.storageKey, newIds);

      const achievement = this.achievements.find((a) => a.id === id);
      if (achievement) {
        this.analytics.trackAchievementUnlocked(id, achievement.title);
        this.completed.set({ ...achievement, unlocked: true });
      } else {
        this.analytics.trackAchievementUnlocked(id, id);
        const dummyAchieve: Achievement = {
          id,
          title: id,
          description: '',
          svgIcon: '',
          rarity: 'common',
          unlocked: true,
        };
        this.completed.set(dummyAchieve);
      }
      return true;
    }
    return false;
  }

  isAllCompleted(): void {
    // Method intentionally left empty.
  }
}
