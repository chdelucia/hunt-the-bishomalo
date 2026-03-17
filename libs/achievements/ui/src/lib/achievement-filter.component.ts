import { ChangeDetectionStrategy, Component, output, input } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

type AchievementFilterType = 'all' | 'unlocked' | 'locked';

@Component({
  selector: 'lib-achievement-filter',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './achievement-filter.component.html',
  styleUrl: './achievement-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AchievementFilterComponent {
  readonly currentFilter = input.required<AchievementFilterType>();
  filterChanged = output<AchievementFilterType>();

  setFilter(filter: AchievementFilterType): void {
    this.filterChanged.emit(filter);
  }
}
