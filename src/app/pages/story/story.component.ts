import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStoryService } from 'src/app/services/story/game-story.service';
import { RouteTypes } from 'src/app/models';

@Component({
  selector: 'app-story',
  standalone: true,
  imports: [CommonModule],
  providers: [],
  templateUrl: './story.component.html',
  styleUrl: './story.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly storyService = inject(GameStoryService);

  readonly story = this.storyService.getStory();

  readonly displayedText = signal('');
  readonly reading = signal(false);
  readonly showExtraInfo = signal(false);

  private fullText = '';

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
  }

  goToGame(): void {
    speechSynthesis.cancel();
    this.router.navigate([RouteTypes.HOME]);
  }

  formatEffect(effect: string): string {
    const effects: Record<string, string> = {
      extraArrow: 'Obtienes una flecha adicional',
      extraLife: 'Recuperas una vida',
      doubleGold: 'Duplicas las monedas obtenidas',
      revealHint: 'Descubres una pista oculta',
      maxLivesUp: 'Tu vida máxima aumenta',
      fogOfWar: 'Partes del mapa se ocultan',
      trapIncrease: 'Aumentan las trampas en el nivel',
      bossReveal: 'Se revela el jefe final',
      bossFight: 'Enfrentas al jefe final',
      unlockUltimateWeapon: 'Desbloqueas el arma definitiva',
    };
    return effects[effect] || effect;
  }

  private startReading(text: string): void {
    this.reading.set(true);
    this.displayedText.set('');

    const chapterText = `Capítulo ${this.story?.level}`;
    const titleText = this.story?.title ?? '';
    const bodyText = text;

    const utterChapter = new SpeechSynthesisUtterance(chapterText);
    utterChapter.lang = 'es-ES';
    utterChapter.pitch = 0.7;
    utterChapter.rate = 0.7;

    const utterTitle = new SpeechSynthesisUtterance(titleText);
    utterTitle.lang = 'es-ES';
    utterTitle.pitch = 0.7;
    utterTitle.rate = 0.8;

    const utterBody = new SpeechSynthesisUtterance(bodyText);
    utterBody.lang = 'es-ES';
    utterBody.pitch = 0.1;
    utterBody.rate = 0.65;

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
    const interval = setInterval(() => {
      const current = this.displayedText();
      this.displayedText.set(current + bodyText[i]);
      i++;
      if (i >= bodyText.length) {
        clearInterval(interval);
        this.reading.set(false);
      }
    }, 90);
  }
}
