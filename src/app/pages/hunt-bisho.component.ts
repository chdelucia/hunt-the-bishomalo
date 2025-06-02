import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AppWumpusAttackAnimationComponent,
  BlackoutComponent,
  GameCellComponent,
  GameMessageComponent,
  MobileControlsComponent,
  TitleComponent,
  GameLivesComponent,
  GameLevelComponent,
} from './../components';
import { VisualEffectDirective } from './../directives/visual-effect.directive';
import { RouterModule } from '@angular/router';
import { GameStore } from '../store';

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
