import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';

import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-instructions',
  imports: [RouterModule, TranslocoModule],
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.scss',
})
export class InstructionsComponent {}
