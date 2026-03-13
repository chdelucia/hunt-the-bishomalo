import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { Achievement } from '@hunt-the-bishomalo/achievements/api';

@Component({
  selector: 'lib-achievement-item',
  standalone: true,
  imports: [NgOptimizedImage, TranslocoModule],
  templateUrl: './achievement-item.component.html',
  styleUrl: './achievement-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AchievementItemComponent {
  achievement = input.required<Achievement>();

  readonly rarityClasses: Record<string, string> = {
    common: 'rarity-common',
    uncommon: 'rarity-uncommon',
    rare: 'rarity-rare',
    epic: 'rarity-epic',
    legendary: 'rarity-legendary',
  };

  readonly rarityClass = computed(
    () => this.rarityClasses[this.achievement().rarity.toLowerCase()] || 'rarity-common',
  );

  readonly rarityBadgeColor = computed(() => {
    switch (this.achievement().rarity.toLowerCase()) {
      case 'common':
        return 'primary';
      case 'uncommon':
        return 'success';
      case 'rare':
        return 'warning';
      case 'epic':
        return 'error';
      case 'legendary':
        return 'error';
      default:
        return 'primary';
    }
  });
}
