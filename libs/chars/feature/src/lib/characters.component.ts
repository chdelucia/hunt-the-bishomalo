import { Component, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Chars, RouteTypes, AchieveTypes } from '@hunt-the-bishomalo/shared-data';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { Router } from '@angular/router';
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'lib-characters',
  standalone: true,
  imports: [NgOptimizedImage, TranslocoModule],
  templateUrl: './characters.component.html',
  styleUrl: './characters.component.scss',
})
export class CharactersComponent {
  readonly gameStore = inject(GAME_STORE_TOKEN);
  private readonly router = inject(Router);
  private readonly achieve = inject(ACHIEVEMENT_SERVICE);

  readonly chars = [Chars.DEFAULT, Chars.LARA, Chars.LEGOLAS, Chars.LINK];
  readonly achievements: Record<Chars, AchieveTypes> = {
    link: AchieveTypes.LINK,
    legolas: AchieveTypes.LEGOLAS,
    lara: AchieveTypes.LARA,
    default: AchieveTypes.PICKGOLD,
  };

  readonly selectedChar = signal<Chars | null>(null);

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
