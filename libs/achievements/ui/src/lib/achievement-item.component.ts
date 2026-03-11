import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { Achievement } from '@hunt-the-bishomalo/achievements/api';

@Component({
  selector: 'lib-achievement-item',
  standalone: true,
  imports: [NgOptimizedImage, TranslocoModule],
  templateUrl: './achievement-item.component.html',
  styleUrl: './achievement-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AchievementItemComponent {
  achievement = input.required<Achievement>();

  readonly rarityClass = computed(
    () => `rarity-${this.achievement().rarity.toLowerCase()}`,
  );
}
