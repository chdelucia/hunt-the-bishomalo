import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { Chars, Direction } from '@hunt-the-bishomalo/shared-data';

@Component({
  selector: 'lib-hunter',
  standalone: true,
  imports: [NgOptimizedImage, TranslocoModule],
  templateUrl: './hunter.component.html',
  styleUrl: './hunter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HunterComponent {
  readonly direction = input.required<Direction>();
  readonly arrows = input.required<number>();
  readonly selectedChar = input.required<string>();
  readonly hasGold = input.required<boolean>();
  readonly size = input.required<number>();
  readonly hasLantern = input.required<boolean>();
  readonly hasShield = input.required<boolean>();

  readonly rotation = computed(() => {
    switch (this.direction()) {
      case Direction.UP:
        return 270;
      case Direction.RIGHT:
        return 0;
      case Direction.DOWN:
        return 90;
      case Direction.LEFT:
        return 180;
      default:
        return 0;
    }
  });

  readonly bowImage = computed(() => {
    const arrows = this.arrows();
    const char = this.selectedChar();

    const extension = char === Chars.DEFAULT ? 'svg' : 'png';
    if (arrows) return `chars/${char}/bow.${extension}`;
    return `chars/${char}/bowempty.${extension}`;
  });

  readonly showGoldIcon = computed(() => this.hasGold() && this.size() < 12);
}
