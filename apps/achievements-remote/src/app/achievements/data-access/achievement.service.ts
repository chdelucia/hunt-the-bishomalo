import { effect, inject, Injectable, signal } from '@angular/core';
import { Achievement, AchieveTypes } from '@hunt-the-bishomalo/shared-data';
import {
  ANALYTICS_SERVICE_TOKEN,
  LOCALSTORAGE_SERVICE_TOKEN,
} from '@hunt-the-bishomalo/core/api';
import { IAchievementService } from '@hunt-the-bishomalo/achievements/api';
import { AchievementsFacade } from './achievements.facade';

@Injectable({
  providedIn: 'root',
})
export class AchievementService implements IAchievementService {
  readonly achievementsSignal = signal<Achievement[]>([]);
  get achievements() {
    return this.achievementsSignal();
  }
  private readonly storageKey = 'hunt_the_bishomalo_achievements';
  readonly completed = signal<Achievement | undefined>(undefined);

  private readonly analytics = inject(ANALYTICS_SERVICE_TOKEN);
  private readonly localStoreService = inject(LOCALSTORAGE_SERVICE_TOKEN);
  private readonly facade = inject(AchievementsFacade);

  constructor() {
    this.listenForExternalAchievements();
    effect(() => {
      const config = this.facade.config();
      if (!config) return;

      fetch(`/assets/achievements/${config.appId}.json`)
        .then((r) => r.json())
        .then((data) => {
          this.achievementsSignal.set(data);
          this.syncAchievementsWithStorage();
        });
    });
  }

  private listenForExternalAchievements(): void {
    window.addEventListener('achievement-unlocked', (event: Event) => {
      const customEvent = event as CustomEvent;
      const id = customEvent.detail?.id;
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
    this.achievementsSignal.update((achievements) =>
      achievements.map((ach) => ({
        ...ach,
        unlocked: storedIds.includes(ach.id),
      })),
    );
  }

  private getStoredAchievementIds(): string[] {
    return this.localStoreService.getValue<string[]>(this.storageKey) || [];
  }

  activeAchievement(id: AchieveTypes | string): void {
    const achievements = this.achievementsSignal();
    const achieve = achievements.find((item) => item.id === id);
    if (achieve && !achieve.unlocked) {
      this.achievementsSignal.update((list) =>
        list.map((item) => (item.id === id ? { ...item, unlocked: true } : item)),
      );
      const updatedAchieve = this.achievementsSignal().find((item) => item.id === id);
      if (updatedAchieve) {
        this.completed.set(updatedAchieve);
        this.updateLocalStorageWithNewId(updatedAchieve.id);
        this.analytics.trackAchievementUnlocked(updatedAchieve.id, updatedAchieve.title);
      }
    }
  }

  isAllCompleted(): void {
    const achievements = this.achievementsSignal();
    const victory = achievements.filter((x) => x.unlocked);
    if (achievements.length > 0 && achievements.length - victory.length <= 1) {
      this.activeAchievement(AchieveTypes.FINAL);
    }
  }
}
