import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  DestroyRef,
} from '@angular/core';

import { Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { GameStoryService } from './game-story.service';
import { RouteTypes } from '@hunt-the-bishomalo/shared-data';
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';

@Component({
  selector: 'lib-story',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './story.component.html',
  styleUrl: './story.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryComponent {
  private readonly router = inject(Router);
  private readonly storyService = inject(GameStoryService);
  private readonly translocoService = inject(TranslocoService);
  private readonly gameStore = inject(GAME_STORE_TOKEN);
  private readonly destroyRef = inject(DestroyRef);

  readonly story = this.storyService.getStory();

  readonly displayedText = signal('');
  readonly reading = signal(false);
  readonly showExtraInfo = signal(false);

  private fullText = '';

  constructor() {
    if (this.story) {
      this.fullText = this.story.text;
      this.startReading(this.fullText);
    } else {
      this.goToGame();
    }

    this.destroyRef.onDestroy(() => {
      speechSynthesis.cancel();
    });
  }

  goToGame(): void {
    speechSynthesis.cancel();
    if (this.story) this.storyService.checkLevelTrigger(this.story);
    this.router.navigate([RouteTypes.HOME]);
  }

  private startReading(text: string): void {
    this.reading.set(false);
    this.displayedText.set(text);
    this.showExtraInfo.set(true);

    const activeLang = this.translocoService.getActiveLang();

    const chapterText = `${this.translocoService.translate('storyPage.chapterPrefix')}${
      this.story?.level
    }`;
    const titleText = this.story?.title ?? '';
    const bodyText = text;

    const utterChapter = new SpeechSynthesisUtterance(chapterText);
    utterChapter.lang = activeLang;
    utterChapter.pitch = 0.7;
    utterChapter.rate = 0.7;

    const utterTitle = new SpeechSynthesisUtterance(titleText);
    utterTitle.lang = activeLang;
    utterTitle.pitch = 0.7;
    utterTitle.rate = 0.8;

    const utterBody = new SpeechSynthesisUtterance(bodyText);
    utterBody.lang = activeLang;
    utterBody.pitch = 0.15;
    utterBody.rate = 0.8;

    speechSynthesis.cancel();

    if (this.gameStore.soundEnabled()) {
      utterChapter.onend = () => {
        speechSynthesis.speak(utterTitle);
      };
      utterTitle.onend = () => {
        speechSynthesis.speak(utterBody);
      };

      speechSynthesis.speak(utterChapter);
    }
  }
}
