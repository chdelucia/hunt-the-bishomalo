import { inject, Injectable } from '@angular/core';
import { LevelStory, STORIES } from './stories.const';
import { GameStore } from 'src/app/store';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root',
})
export class GameStoryService {
  private readonly stories = STORIES;
  private readonly gameStore = inject(GameStore);
  private readonly _settings = this.gameStore.settings;
  private readonly transloco = inject(TranslocoService);

  getStory(): LevelStory | undefined {
    const { size, selectedChar } = this._settings();
    const level = size - 3;
    const charId = selectedChar;
    const charStories = this.stories[charId] || [];
    const story = charStories.find((s) => s.level === level);

    if (story) {
      const titleKey = `story.${charId}.${story.level}.title`;
      const textKey = `story.${charId}.${story.level}.text`;
      return {
        ...story,
        title: this.transloco.translate(titleKey),
        text: this.transloco.translate(textKey),
      };
    }
    return undefined;
  }

  getJournalEntries(): LevelStory[] {
    const { size, selectedChar } = this._settings();
    const level = size - 3;
    const charId = selectedChar;
    const charStories = this.stories[charId] || [];

    return charStories
      .filter((story) => story.level <= level)
      .map((story) => {
        const titleKey = `story.${charId}.${story.level}.title`;
        const textKey = `story.${charId}.${story.level}.text`;
        return {
          ...story,
          title: this.transloco.translate(titleKey),
          text: this.transloco.translate(textKey),
        };
      });
  }

  checkLevelTrigger(level: LevelStory): void {
    switch (level.effect) {
      case 'extraArrow':
        this.gameStore.updateHunter({ arrows: this.gameStore.hunter().arrows + 1 });
        break;
      case 'extraLife':
        this.gameStore.updateGame({ lives: this.gameStore.lives() + 1 });
        break;
      case 'doubleGold':
        this.gameStore.updateHunter({ gold: this.gameStore.hunter().gold + 200 });
        break;
      default:
        break;
    }
  }
}
