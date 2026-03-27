import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
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
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { GAME_ENGINE_TOKEN } from '@hunt-the-bishomalo/game/api';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { AchieveTypes, GameItem } from '@hunt-the-bishomalo/shared-data';
import { GameSideEffectService } from '@hunt-the-bishomalo/game/data-access';

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
  readonly game = inject(GAME_STORE_TOKEN);
  readonly gameEngine = inject(GAME_ENGINE_TOKEN);
  private readonly achieve = inject(ACHIEVEMENT_SERVICE);
  private readonly sideEffect = inject(GameSideEffectService);

  readonly emptyInventory: GameItem[] = [];

  readonly deathByWumpus = computed(() => {
    const gameInstance = this.game;
    return gameInstance?.message() === '¡El Wumpus te devoró!';
  });

  constructor() {
    this.sideEffect.initSideEffects();
  }

  handleclose(): void {
    this.game.setMessage('GAME OVER ' + this.game.message());
  }

  handleMobileShootArrow(): void {
    this.gameEngine.shootArrow();
    this.achieve.activeAchievement(AchieveTypes.GAMER);
  }
}
