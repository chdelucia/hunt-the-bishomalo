import { Component, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Chars, RouteTypes } from 'src/app/models';
import { GameEngineService, GameStoreService } from 'src/app/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-characters',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './characters.component.html',
  styleUrl: './characters.component.scss',
})
export class CharactersComponent {

  readonly gameStore = inject(GameStoreService);
  readonly gameEngine = inject(GameEngineService);
  readonly router = inject(Router)

  readonly chars = [Chars.DEFAULT, Chars.LARA, Chars.LEGOLAS, Chars.LINK];

  selectedChar = signal<Chars | null>(null);

  onClick(): void {
    const selected = this.selectedChar();

    if(selected) {
      this.gameStore.updateHunter({
        chars: [...(this.gameStore.hunter().chars || []), selected]
      });
      this.gameEngine.newGame();
      this.router.navigateByUrl(RouteTypes.HOME);
    }

  }

}
