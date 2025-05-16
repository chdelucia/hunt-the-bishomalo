import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './components';
import { MenuComponent } from "./components/menu/menu.component";
import { GameControlsComponent } from "./components/controls/game-controls.component";
import { GameStoreService } from './services';


@Component({
  imports: [
    RouterModule,
    CommonModule,
    ToastComponent,
    MenuComponent,
    GameControlsComponent
],
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent {
  title = 'hunt-the-bishomalo';
  readonly game = inject(GameStoreService);
}
