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
import { GameStore } from '@hunt-the-bishomalo/core/store';

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

  deathByWumpus = computed(() => {
    const gameInstance = this.game;
    return gameInstance?.message() === '¡El Wumpus te devoró!';
  });

  handleclose(): void {
    this.game.setMessage('GAME OVER ' + this.game.message());
  }
}
