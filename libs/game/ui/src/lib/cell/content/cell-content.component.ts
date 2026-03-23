import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { CellContent } from '@hunt-the-bishomalo/shared-data';

@Component({
  selector: 'lib-cell-content',
  standalone: true,
  imports: [NgOptimizedImage, TranslocoModule],
  templateUrl: './cell-content.component.html',
  styleUrl: './cell-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellContentComponent {
  readonly content = input.required<CellContent>();
}
