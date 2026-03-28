import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { Achievement } from '@hunt-the-bishomalo/shared-data';
import { ASSETS_BASE_URL } from '@hunt-the-bishomalo/achievements/data-access';

@Component({
  selector: 'lib-achievement-item',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './achievement-item.component.html',
  styleUrl: './achievement-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AchievementItemComponent {
  protected readonly ASSETS_BASE_URL = ASSETS_BASE_URL;
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
