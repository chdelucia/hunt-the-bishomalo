import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ASSETS_BASE_URL } from '@hunt-the-bishomalo/shared-data';

@Component({
  selector: 'lib-game-message-display',
  standalone: true,
  imports: [TranslocoModule],
  template: `
    @if (hasMessage()) {
      <p>{{ message() }}</p>
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
}
