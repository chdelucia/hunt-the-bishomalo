import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'lib-game-message-actions',
  standalone: true,
  imports: [TranslocoModule],
  template: `
    @if (lives() <= 0) {
      <button
        class="newgame"
        (click)="newGame.emit()"
        [attr.aria-label]="'message.newGameAriaLabel' | transloco"
      >
        {{ 'message.newGameButton' | transloco }}
      </button>
    } @else {
      @if (shouldShowRetry()) {
        <button
          class="newgame"
          (click)="restartGame.emit()"
          [attr.aria-label]="'message.restartGameAriaLabel' | transloco"
        >
          {{ 'message.tryAgainButton' | transloco }}
        </button>
      } @else if (shouldShowNextLevel()) {
        @if (showCongrats()) {
          <button
            class="newgame"
            (click)="nextLevel.emit()"
            [attr.aria-label]="'message.nextLevelAriaLabel' | transloco"
          >
            {{ 'message.congratsNextLevelButton' | transloco }}
          </button>
        } @else {
          <button
            class="newgame"
            [attr.aria-label]="'message.nextLevelAriaLabel' | transloco"
            (click)="goToBoss.emit()"
          >
            {{ 'message.congratsBossButton' | transloco }}
          </button>
        }
      }
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .newgame {
      background: none;
      animation: blink 3s step-start infinite;
      color: var(--color-primary);
      font-size: 1.4rem;
      text-align: center;
      margin-top: 20px;
      text-shadow: 0 0 1px var(--color-neon);
      cursor: pointer;
      font-family: 'Press Start 2P', monospace;
      border: none;
      padding: 0.75rem;
      font-weight: bold;
      width: fit-content;

      &:hover {
        cursor: pointer;
      }
    }
    @keyframes blink {
      20% {
        opacity: 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .newgame {
        animation: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameMessageActionsComponent {
  readonly lives = input.required<number>();
  readonly shouldShowRetry = input.required<boolean>();
  readonly shouldShowNextLevel = input.required<boolean>();
  readonly showCongrats = input.required<boolean>();

  restartGame = output();
  nextLevel = output();
  newGame = output();
  goToBoss = output();
}
