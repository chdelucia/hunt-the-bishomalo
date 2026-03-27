import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HeartIconComponent } from './heart-icon/heart-icon.component';

@Component({
  selector: 'lib-game-lives',
  standalone: true,
  imports: [HeartIconComponent],
  templateUrl: './game-lives.component.html',
  styleUrl: './game-lives.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameLivesComponent {
  readonly lives = input.required<number>();
  readonly maxLives = input.required<number>();

  readonly livesArray = computed(() => new Array(this.maxLives()).fill(0));
}
