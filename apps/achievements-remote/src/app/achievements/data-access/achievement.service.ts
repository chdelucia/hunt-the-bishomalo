import { inject, Injectable, signal } from '@angular/core';
import { Achievement, AchieveTypes } from '../models/achievements.model';
import { GameSound } from '../models/game-sound.enum';
import { ANALYTICS_SERVICE_TOKEN, GAME_SOUND_TOKEN } from '../api/tokens';
import { IAchievementService, ACHIEVEMENTS_LIST_TOKEN } from '../api/achievement-service.interface';

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

  constructor() {
    this.syncAchievementsWithStorage();
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

  private unlockLocally(id: AchieveTypes | string): void {
    const achieve = this.achievements.find((item) => item.id === id);
    if (achieve && !achieve.unlocked) {
      achieve.unlocked = true;
      this.completed.set(achieve);
      this.updateLocalStorageWithNewId(achieve.id);
      this.analytics.trackAchievementUnlocked(achieve.id, achieve.title);
    }
  }

  private updateLocalStorageWithNewId(id: string): void {
    const storedIds = this.getStoredAchievementIds();
    localStorage.setItem(this.storageKey, JSON.stringify([...storedIds, id]));
  }

  private syncAchievementsWithStorage(): void {
    const storedIds = this.getStoredAchievementIds();
    this.achievements.forEach((achieve) => {
      achieve.unlocked = storedIds.includes(achieve.id);
    });
  }

  private getStoredAchievementIds(): string[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  activeAchievement(id: AchieveTypes | string): void {
    const achieve = this.achievements.find((item) => item.id === id);
    if (achieve && !achieve.unlocked) {
      this.unlockLocally(id);
      // Notify other MFEs via CustomEvent
      window.dispatchEvent(new CustomEvent('achievement-unlocked', { detail: { id } }));
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
