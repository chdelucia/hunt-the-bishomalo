import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-achievement-progress',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './achievement-progress.component.html',
  styleUrl: './achievement-progress.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AchievementProgressComponent {
  readonly unlockedCount = input.required<number>();
  readonly totalCount = input.required<number>();
  readonly percentage = input.required<number>();
}
