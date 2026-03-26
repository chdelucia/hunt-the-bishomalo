import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { Achievement } from '../data-access/achievement.model';

@Component({
  selector: 'app-achievement-item',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './achievement-item.component.html',
  styleUrl: './achievement-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AchievementItemComponent {
  readonly achievement = input.required<Achievement>();

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
