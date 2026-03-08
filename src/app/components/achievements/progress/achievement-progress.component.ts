import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-achievement-progress',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './achievement-progress.component.html',
  styleUrl: './achievement-progress.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AchievementProgressComponent {
  unlockedCount = input.required<number>();
  totalCount = input.required<number>();
  percentage = input.required<number>();
}
