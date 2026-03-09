import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Achievement } from '@hunt-the-bishomalo/data';

@Component({
  selector: 'lib-achievement-item',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, TranslocoModule],
  templateUrl: './achievement-item.component.html',
  styleUrl: './achievement-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AchievementItemComponent {
  achievement = input.required<Achievement>();

  private readonly transloco = inject(TranslocoService);

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

  getRarityName(rarity: string): string {
    return this.transloco.translate('rarity.' + rarity.toLowerCase());
  }
}
