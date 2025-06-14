import { ChangeDetectionStrategy, Component, inject, isDevMode } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { GameEngineService, GameSoundService } from 'src/app/services';
import {
  Chars,
  DIFFICULTY_CONFIGS,
  DifficultyTypes,
  GameDificulty,
  GameSound,
  RouteTypes,
} from 'src/app/models';
import { Router } from '@angular/router';
import { GameStore } from 'src/app/store';

@Component({
  selector: 'app-game-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage, TranslocoModule],
  templateUrl: './game-config.component.html',
  styleUrls: ['./game-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameConfigComponent {
  readonly gameStore = inject(GameStore);
  private readonly gameEngine = inject(GameEngineService);
  private readonly fb = inject(FormBuilder);
  private readonly gameSound = inject(GameSoundService);
  private readonly router = inject(Router);

  isDevMode = isDevMode();
  readonly configs = DIFFICULTY_CONFIGS as Record<string, GameDificulty>;

  configForm: FormGroup = this.fb.group({
    player: ['Kukuxumushu', Validators.required],
    size: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
    selectedChar: [Chars.DEFAULT, [Validators.required]],
    difficulty: [DifficultyTypes.EASY, [Validators.required]],
  });

  submitForm(): void {
    if (this.configForm.valid) {
      const difficulty = this.configForm.value.difficulty as DifficultyTypes;

      this.gameStore.updateGame({
        settings: {
          ...this.configForm.value,
          size: this.configForm.value.size + 3,
          blackout: false,
          difficulty: DIFFICULTY_CONFIGS[difficulty],
          startTime: new Date().toISOString(),
        },
        lives: DIFFICULTY_CONFIGS[difficulty].maxLives,
      });

      this.gameEngine.initGame();
      this.goToStory();
    }
  }

  goToStory(): void {
    this.router.navigate([RouteTypes.STORY], {
      state: { fromSecretPath: true },
    });
  }

  selectChar(char: Chars): void {
    const matchingSound: GameSound = GameSound[char.toUpperCase() as keyof typeof GameSound];
    this.configForm.get('selectedChar')?.setValue(char);
    this.gameSound.stop();
    this.gameSound.playSound(matchingSound, false);
  }
}
