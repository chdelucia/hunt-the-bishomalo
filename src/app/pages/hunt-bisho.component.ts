import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BlackoutComponent } from './../components/blackout/blackout.component';
import { GameMessageComponent } from './../components/message/game-message.component';
import { MobileControlsComponent } from './../components/controls/mobile/mobile-controls.component';
import { GameLivesComponent } from './../components/lives/game-lives.component';
import { GameLevelComponent } from './../components/level/game-level.component';
import { GameBoardComponent } from './../components/board/game-board.component';
import { TitleComponent } from '@hunt-the-bishomalo/shared-ui';
import { VisualEffectDirective } from './../directives/visual-effect.directive';
import { RouterModule } from '@angular/router';
import { GameStore } from '@hunt-the-bishomalo/core/store';

@Component({
  selector: 'app-hunt-bisho',
  imports: [
    RouterModule,
    VisualEffectDirective,
    TitleComponent,
    BlackoutComponent,
    GameMessageComponent,
    MobileControlsComponent,
    GameLivesComponent,
    GameLevelComponent,
    GameBoardComponent,
  ],
  templateUrl: './hunt-bisho.component.html',
  styleUrl: './hunt-bisho.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HuntBishoComponent {
  readonly game = inject(GameStore);

  handleClose(): void {
    this.game.$_setIsEatenByWumpus(false);
    this.game.setMessage('GAME OVER ' + this.game.message());
  }
}
