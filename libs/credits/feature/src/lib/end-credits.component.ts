import { Component, signal, inject, DestroyRef } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { GameSound, RouteTypes } from '@hunt-the-bishomalo/shared-data';
import { GAME_SOUND_TOKEN, GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { GAME_ENGINE_TOKEN } from '@hunt-the-bishomalo/game/api';

@Component({
  selector: 'lib-end-credits',
  standalone: true,
  imports: [RouterModule, TranslocoModule],
  templateUrl: './end-credits.component.html',
  styleUrl: './end-credits.component.scss',
})
export class EndCreditsComponent {
  readonly scrollPosition = signal(0);
  readonly autoScroll = signal(true);
  readonly MAX_SCROLL_POSITION = 1350;

  readonly roleKeys: string[] = [
    'credits.role.leadProgrammer',
    'credits.role.gameDesigner',
    'credits.role.pixelArtist',
    'credits.role.levelDesigner',
    'credits.role.soundEngineer',
    'credits.role.leadTester',
    'credits.role.bishomaloCareTaker',
    'credits.role.pixelCounter',
    'credits.role.error404Specialist',
    'credits.role.creditsWriter',
    'credits.role.specialThanks',
  ];

  private lastTime = 0;
  private animationFrameId = 0;

  private readonly router = inject(Router);
  private readonly gameEngine = inject(GAME_ENGINE_TOKEN);
  private readonly gameSound = inject(GAME_SOUND_TOKEN);
  protected readonly store = inject(GAME_STORE_TOKEN);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.gameSound.stop();
    this.gameSound.playSound(GameSound.GOKU, false);
    this.startAutoScroll();

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(this.animationFrameId);
      this.gameSound.stop();
    });
  }

  private startAutoScroll(): void {
    const animate = (time: number) => {
      if (this.lastTime === 0) this.lastTime = time;
      const delta = time - this.lastTime;
      this.lastTime = time;

      if (this.autoScroll()) {
        const nextScroll = this.scrollPosition() + delta * 0.05;
        if (nextScroll >= this.MAX_SCROLL_POSITION) {
          this.scrollPosition.set(this.MAX_SCROLL_POSITION);
          this.autoScroll.set(false);
          this.gameSound.stop();
          return;
        } else {
          this.scrollPosition.set(nextScroll);
        }
      }

      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  newGame(): void {
    this.gameEngine.newGame();
    this.router.navigateByUrl(RouteTypes.SETTINGS);
  }

  backToHome(): void {
    this.router.navigateByUrl(RouteTypes.HOME);
  }
}
