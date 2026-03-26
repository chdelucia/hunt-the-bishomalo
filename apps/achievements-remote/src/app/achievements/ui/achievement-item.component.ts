import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-achievement-item',
  standalone: true,
  imports: [NgOptimizedImage, TranslocoModule],
  templateUrl: './achievement-item.component.html',
  styleUrl: './achievement-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AchievementItemComponent {
  readonly achievement = input.required<any>();

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
}
