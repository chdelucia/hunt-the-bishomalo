import { inject, Injectable } from '@angular/core';
import { LevelStory, STORIES } from './stories.const';
import { GameStoreService } from '../store/game-store.service';

@Injectable({
  providedIn: 'root',
})
export class GameStoryService {
  private readonly stories = STORIES;
  private readonly gameStore = inject(GameStoreService);
  private readonly _settings = this.gameStore.settings;

  getStory(): LevelStory | undefined {
    const { size, selectedChar } = this._settings();
    const level = size - 3;
    const charStories = this.stories[selectedChar] || [];
    return charStories.find((story) => story.level === level);
  }

  getJournalEntries(): LevelStory[] {
    const { size, selectedChar } = this._settings();
    const level = size - 3;
    const charStories = this.stories[selectedChar] || [];
    return charStories.filter((story) => story.level <= level);
  }

  checkLevelTrigger(level: LevelStory): void {
    switch (level.effect) {
      case 'extraArrow':
        this.gameStore.updateHunter({ arrows: this.gameStore.hunter().arrows + 1 });
        break;
      case 'extraLife':
        this.gameStore.updateHunter({ lives: this.gameStore.hunter().lives + 1 });
        break;
      case 'doubleGold':
        this.gameStore.updateHunter({ gold: this.gameStore.hunter().gold + 200 });
        break;
      default:
        break;
    }
  }
}
