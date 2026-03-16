import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'lib-instructions',
  standalone: true,
  imports: [RouterModule, TranslocoModule],
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.scss',
})
export class InstructionsComponent {
  /**
   * Component created to handle the instructions page.
   * Content is purely static and managed via the HTML template.
   */
}
