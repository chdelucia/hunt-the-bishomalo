import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-instructions',
  imports: [CommonModule, RouterModule, TranslocoModule],
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.scss',
})
export class InstructionsComponent {}
