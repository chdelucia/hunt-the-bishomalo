import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import {
  AppWumpusAttackAnimationComponent,
  BlackoutComponent,
  GameCellComponent,
  GameMessageComponent,
  MobileControlsComponent,
  GameLivesComponent,
  GameLevelComponent,
  VisualEffectDirective,
} from '@hunt-the-bishomalo/game/ui';
import { TitleComponent } from '@hunt-the-bishomalo/shared-ui';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { GAME_STORE_TOKEN, GAME_SOUND_TOKEN } from '@hunt-the-bishomalo/core/api';
import { GAME_ENGINE_TOKEN } from '@hunt-the-bishomalo/game/api';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { AchieveTypes, GameSound, GameItem } from '@hunt-the-bishomalo/shared-data';

@Component({
  selector: 'lib-game',
  imports: [
    RouterModule,
    TranslocoModule,
    GameCellComponent,
    VisualEffectDirective,
    AppWumpusAttackAnimationComponent,
    TitleComponent,
    BlackoutComponent,
    GameMessageComponent,
    MobileControlsComponent,
    GameLivesComponent,
    GameLevelComponent,
  ],
  templateUrl: './game.html',
  styleUrl: './game.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Game {
  readonly game = inject(GAME_STORE_TOKEN);
  readonly gameEngine = inject(GAME_ENGINE_TOKEN);
  private readonly achieve = inject(ACHIEVEMENT_SERVICE);
  private readonly sound = inject(GAME_SOUND_TOKEN);

  readonly emptyInventory: GameItem[] = [];

  readonly deathByWumpus = computed(() => {
    const gameInstance = this.game;
    return gameInstance?.message() === '¡El Wumpus te devoró!';
  });

  constructor() {
    effect(() => {
      const isAlive = this.game.isAlive();
      const hasWon = this.game.hasWon();
      const settings = this.game.settings();

      if (settings?.blackout && isAlive && !hasWon) {
        this.sound.playSound(GameSound.BLACKOUT, false);
        this.achieve.activeAchievement(AchieveTypes.BLACKOUT);
      }
    });

    effect(() => {
      if (this.game.wumpusKilled() === 5) {
        this.achieve.activeAchievement(AchieveTypes.PENTA);
        this.sound.playSound(GameSound.PENTA, false);
      }
    });

    effect(() => {
      if (!this.game.isAlive()) {
        const achievement = this.game.blackout()
          ? AchieveTypes.DEATHBYBLACKOUT
          : AchieveTypes.LASTBREATH;
        this.achieve.activeAchievement(achievement);
      }
    });
  }

  handleclose(): void {
    this.game.setMessage('GAME OVER ' + this.game.message());
  }

  handleMobileShootArrow(): void {
    this.gameEngine.shootArrow();
    this.achieve.activeAchievement(AchieveTypes.GAMER);
  }
}
