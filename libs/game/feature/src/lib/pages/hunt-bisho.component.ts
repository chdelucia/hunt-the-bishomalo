import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AppWumpusAttackAnimationComponent,
  BlackoutComponent,
  GameMessageComponent,
  MobileControlsComponent,
  TitleComponent,
  GameLivesComponent,
  GameLevelComponent,
  sharedUiRoutes,
} from '@hunt-the-bishomalo/shared-ui';
import { GameCellComponent } from '@hunt-the-bishomalo/game-feature';
import { VisualEffectDirective } from '@hunt-the-bishomalo/shared-directives';
import { RouterModule } from '@angular/router';
import { GameStore } from '@hunt-the-bishomalo/game-data-access';

@Component({
  selector: 'app-hunt-bisho',
  imports: [
    RouterModule,
    CommonModule,
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
