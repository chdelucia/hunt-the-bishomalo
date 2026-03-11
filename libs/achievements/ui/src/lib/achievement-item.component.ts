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

  readonly rarityColors: Record<string, string> = {
    common: 'bg-gray-500',
    uncommon: 'bg-green-500',
    rare: 'bg-blue-500',
    epic: 'bg-purple-500',
    legendary: 'bg-yellow-500',
  };

  readonly rarityColor = computed(
    () => this.rarityColors[this.achievement().rarity.toLowerCase()] || 'bg-gray-500',
  );
}
