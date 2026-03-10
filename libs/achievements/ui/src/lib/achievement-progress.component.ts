import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'lib-achievement-progress',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './achievement-progress.component.html',
  styleUrl: './achievement-progress.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AchievementProgressComponent {
  unlockedCount = input.required<number>();
  totalCount = input.required<number>();
  percentage = input.required<number>();
}
