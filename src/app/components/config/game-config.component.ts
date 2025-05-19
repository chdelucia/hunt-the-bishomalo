import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { GameEngineService, GameSoundService, GameStoreService } from 'src/app/services';
import { Chars, GameSound } from 'src/app/models';

@Component({
  selector: 'app-game-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './game-config.component.html',
  styleUrls: ['./game-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameConfigComponent implements OnInit {
  readonly gameStore = inject(GameStoreService);
  private readonly gameEngine = inject(GameEngineService);
  private readonly fb = inject(FormBuilder);
  private readonly gameSound = inject(GameSoundService);

  configForm: FormGroup = this.fb.group({
    player: [this.gameStore.prevName, Validators.required],
    size: [4, [Validators.required, Validators.min(4), Validators.max(20)]],
    pits: [2, [Validators.required, Validators.min(1)]],
    arrows: [1, [Validators.required, Validators.min(1)]],
    selectedChar: [Chars.DEFAULT, [Validators.required]],
  });

  ngOnInit(): void {
    this.gameEngine.syncSettingsWithStorage();
  }

  submitForm(): void {
    if (this.configForm.valid) {
      this.gameEngine.initGame({
        ...this.configForm.value,
        blackout: this.applyBlackoutChance(),
      });
    }
  }

  selectChar(char: Chars): void {
    const matchingSound: GameSound = GameSound[char.toUpperCase() as keyof typeof GameSound];
    this.configForm.get('selectedChar')?.setValue(char);
    this.gameSound.stop();
    this.gameSound.playSound(matchingSound, false);
  }

  private applyBlackoutChance(): boolean {
    const blackoutChance = 0.15;
    return Math.random() < blackoutChance;
  }
}
