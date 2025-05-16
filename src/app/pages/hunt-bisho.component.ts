import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStoreService } from './../services';
import {
  AppWumpusAttackAnimationComponent,
  BlackoutComponent,
  GameCellComponent, 
  GameConfigComponent, 
  GameMessageComponent, 
  MobileControlsComponent, 
  TitleComponent,
  GameLivesComponent,
  GameLevelComponent
} from './../components';
import { VisualEffectDirective } from './../directives/visual-effect.directive';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hunt-bisho',
  imports: [
    RouterModule,
    CommonModule,
    GameConfigComponent,
    GameCellComponent,
    VisualEffectDirective,
    AppWumpusAttackAnimationComponent,
    TitleComponent,
    BlackoutComponent,
    GameMessageComponent,
    MobileControlsComponent,
    GameLivesComponent,
    GameLevelComponent
],
  templateUrl: './hunt-bisho.component.html',
  styleUrl: './hunt-bisho.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HuntBishoComponent {
  readonly game = inject(GameStoreService);
  readonly hunter = this.game.hunter;

  deathByWumpus = computed(() => {
    const gameInstance = this.game;
    return gameInstance?.message() === '¡El Wumpus te devoró!'
  });

  handleclose(): void {
    this.game.setMessage('GAME OVER ' + this.game.message());
  }
}
