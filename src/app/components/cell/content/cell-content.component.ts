import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { CellContent } from '@hunt-the-bishomalo/data';

@Component({
  selector: 'app-cell-content',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './cell-content.component.html',
  styleUrl: './cell-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellContentComponent {
  readonly content = input.required<CellContent>();
}
