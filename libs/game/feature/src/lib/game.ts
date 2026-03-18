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
import { GameStore } from '@hunt-the-bishomalo/core/store';
import { GameEngineService } from '@hunt-the-bishomalo/game/data-access';
import { GameSoundService } from '@hunt-the-bishomalo/core/services';
import {
  ACHIEVEMENT_SERVICE,
  IAchievementService,
} from '@hunt-the-bishomalo/achievements/api';
import { GAME_ACHIEVEMENTS_SERVICE } from '@hunt-the-bishomalo/game/api';
import { AchieveTypes, GameSound } from '@hunt-the-bishomalo/data';

@Component({
  selector: 'lib-game',
  imports: [
    RouterModule,
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
  readonly game = inject(GameStore);
  private readonly gameEngine = inject(GameEngineService);
  private readonly achieve = inject(ACHIEVEMENT_SERVICE) as IAchievementService;
  private readonly gameAchieve = inject(GAME_ACHIEVEMENTS_SERVICE);
  private readonly sound = inject(GameSoundService);

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
        this.gameAchieve.activeAchievement(AchieveTypes.BLACKOUT);
      }
    });
  }

  handleclose(): void {
    this.game.setMessage('GAME OVER ' + this.game.message());
  }

  handleNewGame(): void {
    this.gameEngine.newGame();
  }

  handleRestart(): void {
    this.gameEngine.initGame();
  }

  handleMoveForward(): void {
    this.gameEngine.moveForward();
  }

  handleTurnLeft(): void {
    this.gameEngine.turnLeft();
  }

  handleTurnRight(): void {
    this.gameEngine.turnRight();
  }

  handleShootArrow(): void {
    this.gameEngine.shootArrow();
  }

  handleMobileShootArrow(): void {
    this.handleShootArrow();
    this.gameAchieve.activeAchievement(AchieveTypes.GAMER);
  }
}
