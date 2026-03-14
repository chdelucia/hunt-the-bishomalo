import { Component, inject, signal, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Achievement, ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import {
  AchievementFilterComponent,
  AchievementItemComponent,
  AchievementProgressComponent
} from '@hunt-the-bishomalo/achievements/ui';

@Component({
  selector: 'lib-achievements',
  standalone: true,
  imports: [
    RouterModule,
    TranslocoModule,
    AchievementFilterComponent,
    AchievementItemComponent,
    AchievementProgressComponent,
  ],
  templateUrl: './achievements.html',
  styleUrl: './achievements.scss',
})
export class AchievementsComponent {
  private readonly achieveService = inject(ACHIEVEMENT_SERVICE);

  readonly filter = signal<'all' | 'unlocked' | 'locked'>('all');
  readonly achievements = signal<Achievement[]>(this.achieveService.achievements);

  readonly filteredAchievements = computed(() => {
    const currentFilter = this.filter();
    return this.achievements().filter((achievement) => {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'unlocked') return achievement.unlocked;
      if (currentFilter === 'locked') return !achievement.unlocked;
      return true;
    });
  });

  readonly unlockedCount = computed(() => this.achievements().filter((a) => a.unlocked).length);
  readonly percentage = computed(() => {
    const total = this.achievements().length;
    if (total === 0) return 0;
    return Math.round((this.unlockedCount() / total) * 100);
  });

  setFilter(newFilter: 'all' | 'unlocked' | 'locked'): void {
    this.filter.set(newFilter);
  }
}
