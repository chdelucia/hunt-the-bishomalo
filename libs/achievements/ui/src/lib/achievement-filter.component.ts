import { ChangeDetectionStrategy, Component, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'lib-achievement-filter',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './achievement-filter.component.html',
  styleUrl: './achievement-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AchievementFilterComponent {
  currentFilter = input.required<'all' | 'unlocked' | 'locked'>();
  filterChanged = output<'all' | 'unlocked' | 'locked'>();

  setFilter(filter: 'all' | 'unlocked' | 'locked'): void {
    this.filterChanged.emit(filter);
  }
}
