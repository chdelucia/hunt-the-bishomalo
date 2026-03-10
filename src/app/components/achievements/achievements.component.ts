import { Component, inject, signal, computed } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AchievementService } from '@hunt-the-bishomalo/achievements';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [RouterModule, NgOptimizedImage, TranslocoModule],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.scss',
})
export class AchievementsComponent {
  private readonly achieveService = inject(AchievementService);
  private readonly translocoService = inject(TranslocoService);

  readonly filter = signal<'all' | 'unlocked' | 'locked'>('all');
  readonly achievements = signal(this.achieveService.achievements);

  readonly filteredAchievements = computed(() => {
    const filter = this.filter();
    const achievements = this.achievements();
    return achievements.filter((achievement) => {
      if (filter === 'all') return true;
      if (filter === 'unlocked') return achievement.unlocked;
      if (filter === 'locked') return !achievement.unlocked;
      return true;
    });
  });

  readonly unlockedCount = computed(
    () => this.achievements().filter((a) => a.unlocked).length,
  );

  readonly percentage = computed(() => {
    const total = this.achievements().length;
    if (total === 0) return 0;
    return Math.round((this.unlockedCount() / total) * 100);
  });

  rarityColors = {
    common: 'bg-gray-500',
    uncommon: 'bg-green-500',
    rare: 'bg-blue-500',
    epic: 'bg-purple-500',
    legendary: 'bg-yellow-500',
  };

  setFilter(newFilter: 'all' | 'unlocked' | 'locked'): void {
    this.filter.set(newFilter);
  }

  getRarityColor(rarity: string): string {
    return this.rarityColors[rarity as keyof typeof this.rarityColors];
  }

  getRarityName(rarity: string): string {
    return this.translocoService.translate('rarity.' + rarity.toLowerCase());
  }
}
