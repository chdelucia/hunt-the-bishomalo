import { effect, inject, Injectable, signal, untracked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Achievement, AchieveTypes } from './achievement.model';
import {
  ANALYTICS_SERVICE_TOKEN,
  LOCALSTORAGE_SERVICE_TOKEN,
} from './core-api.model';
import { IAchievementService } from './achievement-service.interface';
import { AchievementsFacade } from './achievements.facade';

@Injectable({
  providedIn: 'root',
})
export class AchievementService implements IAchievementService {
  readonly achievementsSignal = signal<Achievement[]>([]);
  get achievements() {
    return this.achievementsSignal;
  }
  private readonly storageKey = 'hunt_the_bishomalo_achievements';
  readonly completed = signal<Achievement | undefined>(undefined);

  private readonly analytics = inject(ANALYTICS_SERVICE_TOKEN);
  private readonly localStoreService = inject(LOCALSTORAGE_SERVICE_TOKEN);
  private readonly facade = inject(AchievementsFacade);
  private readonly http = inject(HttpClient);

  private activeBuffer: (AchieveTypes | string)[] = [];

  constructor() {
    this.listenForExternalAchievements();
    effect(() => {
      const config = this.facade.config();
      if (!config) return;

      this.http.get<Achievement[]>(`/assets/achievements/${config.appId}.json`).subscribe({
        next: (data) => {
          this.achievementsSignal.set(data);
          untracked(() => {
            this.syncAchievementsWithStorage();
            this.processBuffer();
          });
        },
        error: (err) => {
          // eslint-disable-next-line no-console
          console.error('Remote AchievementService: Error loading JSON', err);
        },
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

  private processBuffer(): void {
    const buffer = [...this.activeBuffer];
    this.activeBuffer = [];
    buffer.forEach((id) => this.activeAchievement(id));
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
    if (achievements.length === 0) {
      this.activeBuffer.push(id);
      return;
    }

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
    } else if (achieve && achieve.unlocked) {
      this.completed.set(achieve);
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
