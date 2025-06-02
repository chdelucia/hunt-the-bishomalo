import { Component, OnDestroy, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { GameSound, RouteTypes } from 'src/app/models';
import { GameEngineService, GameSoundService } from 'src/app/services';

@Component({
  selector: 'app-end-credits',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule],
  templateUrl: './end-credits.component.html',
  styleUrl: './end-credits.component.scss',
})
export class EndCreditsComponent implements OnInit, OnDestroy {
  readonly scrollPosition = signal(0);
  readonly autoScroll = signal(true);
  readonly MAX_SCROLL_POSITION = 2600;

  // Store keys for roles, to be translated in ngOnInit
  private readonly roleKeys: string[] = [
    'leadProgrammer',
    'gameDesigner',
    'pixelArtist',
    'musicComposer',
    'levelDesigner',
    'soundEngineer',
    'leadTester',
    'marketingSpecialist',
    'communityManager',
    'narrator',
    'bishomaloVoice',
    'bishomaloCareTaker',
    'pitExpert',
    'batTrainer',
    'arrowManufacturer',
    'caveExplorer',
    'timeMaster',
    'goldGuardian',
    'pixelCounter',
    'error404Specialist',
    'creditsWriter',
    'specialThanks',
  ];
  readonly roles = signal<string[]>([]);

  private lastTime = 0;
  private animationFrameId = 0;

  private readonly router = inject(Router);
  private readonly gameEngine = inject(GameEngineService);
  private readonly gameSound = inject(GameSoundService);
  private readonly translocoService = inject(TranslocoService);

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

  ngOnInit(): void {
    this.roles.set(
      this.roleKeys.map((key) => this.translocoService.translate(`credits.role.${key}`)),
    );
    this.gameSound.stop();
    this.gameSound.playSound(GameSound.GOKU, false);
    this.startAutoScroll();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
  }

  newGame(): void {
    this.gameEngine.newGame();
    this.router.navigateByUrl(RouteTypes.SETTINGS);
  }
}
