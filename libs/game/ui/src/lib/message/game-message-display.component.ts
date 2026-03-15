import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'lib-game-message-display',
  standalone: true,
  imports: [NgOptimizedImage, TranslocoModule],
  template: `
    @if (hasMessage()) {
      <p>{{ message() }}</p>
      @if (bolaDrac()) {
        <img
          ngSrc="boardicons/b4.png"
          width="32"
          height="32"
          [alt]="'message.dragonBallAlt' | transloco"
        />
      }
    }
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameMessageDisplayComponent {
  message = input.required<string>();
  hasMessage = input.required<boolean>();
  bolaDrac = input.required<boolean>();
}
