import { Component, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AchieveTypes, Chars, RouteTypes } from 'src/app/models';
import { AchievementService } from 'src/app/services';
import { Router } from '@angular/router';
import { GameStore } from 'src/app/store';

import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-characters',
  imports: [CommonModule, NgOptimizedImage, TranslocoModule],
  templateUrl: './characters.component.html',
  styleUrl: './characters.component.scss',
})
export class CharactersComponent {
  readonly gameStore = inject(GameStore);
  private readonly router = inject(Router);
  private readonly achieve = inject(AchievementService);

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
        unlockedChars: [...(this.gameStore.unlockedChars()), selected],
      });
      this.achieve.activeAchievement(this.achievements[selected]);
      this.router.navigateByUrl(RouteTypes.CREDITS);
    }
  }
}
