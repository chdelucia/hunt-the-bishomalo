import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { RouterModule, Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { GAME_FACADE_TOKEN, GAME_SIDE_EFFECT_TOKEN } from '@hunt-the-bishomalo/game/api';
import { GameItem, RouteTypes } from '@hunt-the-bishomalo/shared-data';

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
  readonly facade = inject(GAME_FACADE_TOKEN);
  private readonly sideEffects = inject(GAME_SIDE_EFFECT_TOKEN);
  private readonly router = inject(Router);

  readonly emptyInventory: GameItem[] = [];

  handleClose(): void {
    this.facade.updateGame({ deathByWumpus: false });
  }

  handleMobileShootArrow(): void {
    this.facade.performAction();
  }
}
