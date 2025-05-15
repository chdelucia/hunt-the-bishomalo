import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GameEngineService, GameStoreService } from 'src/app/services';

@Component({
  selector: 'app-game-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './game-config.component.html',
  styleUrls: ['./game-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameConfigComponent {
  readonly game = inject(GameEngineService);
  readonly gameStore = inject(GameStoreService);
  private readonly fb = inject(FormBuilder);

  configForm: FormGroup = this.fb.group({
    player: [this.gameStore.prevName, Validators.required],
    size: [4, [Validators.required, Validators.min(4), Validators.max(20)]],
    pits: [2, [Validators.required, Validators.min(1)]],
    arrows: [1, [Validators.required, Validators.min(1)]],
  });

  submitForm(): void {
    if (this.configForm.valid) {
      this.game.initGame(
        {
          ...this.configForm.value, 
          blackout: this.applyBlackoutChance()
        }
      );
    }
  }

  private applyBlackoutChance(): boolean {
    const blackoutChance = 0.15;
    return Math.random() < blackoutChance;
  }
}
