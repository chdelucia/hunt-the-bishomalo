import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { GameStoryService } from 'src/app/services/story/game-story.service';
import { LevelStory } from 'src/app/services/story/stories.const';

@Component({
  selector: 'app-traveler-diary',
  imports: [CommonModule, TranslocoModule],
  standalone: true,
  templateUrl: './traveler-diary.component.html',
  styleUrl: './traveler-diary.component.scss',
})
export class TravelerDiaryComponent implements OnInit {
  private readonly storyService = inject(GameStoryService);
  private readonly translocoService = inject(TranslocoService);

  readonly stories = signal<LevelStory[]>([]);

  ngOnInit(): void {
    this.stories.set(this.storyService.getJournalEntries());
  }

  formatEffect(effect: string): string {
    // Effect keys are like 'extraArrow', 'extraLife', etc.
    // Translation keys are like 'diary.effect.extraArrow'
    const translationKey = `diary.effect.${effect}`;
    const translatedEffect = this.translocoService.translate(translationKey);

    // Fallback to the original effect key if translation is missing
    // This check is needed because translate might return the key itself if not found.
    return translatedEffect !== translationKey ? translatedEffect : effect;
  }
}
