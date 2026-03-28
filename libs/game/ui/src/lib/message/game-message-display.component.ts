import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ASSETS_BASE_URL } from '@hunt-the-bishomalo/shared-data';

@Component({
  selector: 'lib-game-message-display',
  standalone: true,
  imports: [NgOptimizedImage, TranslocoModule],
  template: `
    @if (hasMessage()) {
      <p>{{ message() }}</p>
      @if (bolaDrac()) {
        <img
          [ngSrc]="ASSETS_BASE_URL + '/boardicons/b4.png'"
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
  protected readonly ASSETS_BASE_URL = ASSETS_BASE_URL;
  readonly message = input.required<string>();
  readonly hasMessage = input.required<boolean>();
  readonly bolaDrac = input.required<boolean>();
}
