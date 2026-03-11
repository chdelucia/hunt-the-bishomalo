import { Component, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Chars, RouteTypes } from '@hunt-the-bishomalo/data';
import { ACHIEVEMENT_SERVICE, AchieveTypes } from '@hunt-the-bishomalo/achievements/api';
import { Router } from '@angular/router';
import { GameStore } from '@hunt-the-bishomalo/core/store';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'lib-characters',
  standalone: true,
  imports: [NgOptimizedImage, TranslocoModule],
  templateUrl: './characters.component.html',
  styleUrl: './characters.component.css',
})
export class CharactersComponent {
  readonly gameStore = inject(GameStore);
  private readonly router = inject(Router);
  private readonly achieve = inject(ACHIEVEMENT_SERVICE);

  readonly chars = [Chars.DEFAULT, Chars.LARA, Chars.LEGOLAS, Chars.LINK];
  readonly achievements: Record<Chars, AchieveTypes> = {
    link: AchieveTypes.LINK,
    legolas: AchieveTypes.LEGOLAS,
    lara: AchieveTypes.LARA,
    default: AchieveTypes.PICKGOLD,
  };

  selectedChar = signal<Chars | null>(null);

  onClick(): void {
    const selected = this.selectedChar();

    if (selected) {
      this.gameStore.updateGame({
        unlockedChars: [...this.gameStore.unlockedChars(), selected],
      });
      this.achieve.activeAchievement(this.achievements[selected]);
      this.router.navigateByUrl(RouteTypes.CREDITS);
    }
  }
}
