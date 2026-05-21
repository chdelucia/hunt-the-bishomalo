import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
  computed,
  input,
  OnInit,
} from '@angular/core';
import { ASSETS_BASE_URL } from '@hunt-the-bishomalo/shared-data';

@Component({
  selector: 'lib-wumpus-attack-animation',
  standalone: true,
  templateUrl: './wumpus-attack-animation.component.html',
  styleUrls: ['./wumpus-attack-animation.component.scss'],
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppWumpusAttackAnimationComponent implements OnInit {
  protected readonly ASSETS_BASE_URL = ASSETS_BASE_URL;
  readonly step = signal(1);
  readonly selectedChar = input.required<string>();
  readonly closeAnimation = output<void>();

  ngOnInit(): void {
    this.step.set(5);
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
