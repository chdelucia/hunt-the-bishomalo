import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  output,
  signal,
  computed,
  inject,
  DestroyRef,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';

@Component({
  selector: 'lib-wumpus-attack-animation',
  standalone: true,
  templateUrl: './wumpus-attack-animation.component.html',
  styleUrls: ['./wumpus-attack-animation.component.scss'],
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WumpusAttackAnimationComponent implements OnInit {
  readonly step = signal(1);
  readonly selectedChar = input.required<string>();
  readonly closeAnimation = output<void>();

  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const steps = [500, 1000, 1500, 2000, 3500];

    steps.forEach((delay, index) => {
      timer(delay)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          if (index < 4) {
            this.step.set(index + 2);
          } else {
            this.closeAnimation.emit();
          }
        });
    });
  }

  readonly getPlayerLeft = computed(() => {
    switch (this.step()) {
      case 1:
        return '-100px';
      case 2:
        return '-50px';
      case 3:
        return '0';
      case 4:
        return '20px';
      default:
        return '40px';
    }
  });

  readonly getWumpusScale = computed(() => {
    switch (this.step()) {
      case 1:
        return 1;
      case 2:
        return 1.2;
      case 3:
        return 1.5;
      case 4:
        return 1.8;
      default:
        return 2;
    }
  });
}
