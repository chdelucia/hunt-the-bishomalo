import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Achievement } from '@hunt-the-bishomalo/data';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/core/services';
import { AchievementFilterComponent } from '../components/filter/achievement-filter.component';
import { AchievementItemComponent } from '../components/item/achievement-item.component';
import { AchievementProgressComponent } from '../components/progress/achievement-progress.component';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'lib-achievements',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoModule,
    AchievementFilterComponent,
    AchievementItemComponent,
    AchievementProgressComponent,
  ],
  templateUrl: './achievements.html',
  styleUrl: './achievements.scss',
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger('50ms', animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
})
export class AchievementsComponent implements OnInit {
  private readonly achieveService = inject(ACHIEVEMENT_SERVICE);

  filter: 'all' | 'unlocked' | 'locked' = 'all';
  achievements: Achievement[] = (this.achieveService as any).achievements;
  filteredAchievements: Achievement[] = [];

  unlockedCount = 0;
  percentage = 0;

  ngOnInit(): void {
    this.updateFilteredAchievements();
    this.calculateProgress();
  }

  updateFilteredAchievements(): void {
    this.filteredAchievements = this.achievements.filter((achievement) => {
      if (this.filter === 'all') return true;
      if (this.filter === 'unlocked') return achievement.unlocked;
      if (this.filter === 'locked') return !achievement.unlocked;
      return true;
    });
  }

  calculateProgress(): void {
    this.unlockedCount = this.achievements.filter((a) => a.unlocked).length;
    this.percentage = Math.round((this.unlockedCount / this.achievements.length) * 100);
  }

  setFilter(newFilter: 'all' | 'unlocked' | 'locked'): void {
    this.filter = newFilter;
    this.updateFilteredAchievements();
  }
}
