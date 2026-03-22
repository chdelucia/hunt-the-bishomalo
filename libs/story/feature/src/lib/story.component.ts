import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';

import { Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { GameStoryService } from './game-story.service';
import { RouteTypes } from '@hunt-the-bishomalo/shared-data';

@Component({
  selector: 'lib-story',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './story.component.html',
  styleUrl: './story.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly storyService = inject(GameStoryService);
  private readonly translocoService = inject(TranslocoService);

  readonly story = this.storyService.getStory();

  readonly displayedText = signal('');
  readonly reading = signal(false);
  readonly showExtraInfo = signal(false);

  private fullText = '';
  private intervalId?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    if (this.story) {
      this.fullText = this.story.text;
      this.startReading(this.fullText);
    } else {
      this.goToGame();
    }
  }

  ngOnDestroy(): void {
    speechSynthesis.cancel();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  goToGame(): void {
    speechSynthesis.cancel();
    if (this.story) this.storyService.checkLevelTrigger(this.story);
    this.router.navigate([RouteTypes.HOME]);
  }

  private startReading(text: string): void {
    this.reading.set(true);
    this.displayedText.set('');
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
    utterChapter.onend = () => {
      speechSynthesis.speak(utterTitle);
    };
    utterTitle.onend = () => {
      speechSynthesis.speak(utterBody);
    };

    utterBody.onend = () => {
      this.showExtraInfo.set(true);
    };

    speechSynthesis.speak(utterChapter);

    let i = 0;
    this.intervalId = setInterval(() => {
      const current = this.displayedText();
      this.displayedText.set(current + bodyText[i]);
      i++;
      if (i >= bodyText.length) {
        clearInterval(this.intervalId);
        this.reading.set(false);
      }
    }, 90);
  }
}
