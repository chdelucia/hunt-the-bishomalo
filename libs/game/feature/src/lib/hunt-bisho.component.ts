import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GameStore } from '@hunt-the-bishomalo/game/data-access';
import {
  BlackoutComponent,
  GameCellComponent,
  GameMessageComponent,
  MobileControlsComponent,
  GameLivesComponent,
  GameLevelComponent,
  VisualEffectDirective
} from '@hunt-the-bishomalo/game/ui';
import { TitleComponent } from '@hunt-the-bishomalo/shared/ui';
import { AppWumpusAttackAnimationComponent } from './animations/attack/app-wumpus-attack-animation.component';

@Component({
  selector: 'app-hunt-bisho',
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
  templateUrl: './hunt-bisho.component.html',
  styleUrl: './hunt-bisho.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HuntBishoComponent {
  readonly game = inject(GameStore);

  deathByWumpus = computed(() => {
    const gameInstance = this.game;
    return gameInstance?.message() === '¡El Wumpus te devoró!';
  });

  handleclose(): void {
    this.game.setMessage('GAME OVER ' + this.game.message());
  }
}
