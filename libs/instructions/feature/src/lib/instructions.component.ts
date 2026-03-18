import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'lib-instructions',
  standalone: true,
  imports: [RouterModule, TranslocoModule],
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * InstructionsComponent is a pure template container that displays the game instructions.
 * No additional logic is required in the class as all functionality is handled via the template.
 */
export class InstructionsComponent {}
