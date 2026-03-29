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
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { GAME_FACADE_TOKEN } from '@hunt-the-bishomalo/game/api';
import { GameItem } from '@hunt-the-bishomalo/shared-data';

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

  readonly emptyInventory: GameItem[] = [];

  handleClose(): void {
    this.facade.newGame();
  }

  handleMobileShootArrow(): void {
    this.facade.shootArrow();
  }
}
