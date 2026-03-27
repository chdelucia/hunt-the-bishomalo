import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-heart-icon',
  standalone: true,
  templateUrl: './heart-icon.component.html',
  styleUrl: './heart-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeartIconComponent {
  isActive = input.required<boolean>();
}
