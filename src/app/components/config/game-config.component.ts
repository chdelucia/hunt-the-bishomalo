import { ChangeDetectionStrategy, Component, inject, isDevMode, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { GameEngineService, GameSoundService, GameStoreService } from 'src/app/services';
import { Chars, DIFFICULTY_CONFIGS, DifficultyTypes, GameSound, RouteTypes } from 'src/app/models';
import { Router } from '@angular/router';

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
   private router = inject(Router);

  isDevMode = isDevMode();

  configForm: FormGroup = this.fb.group({
    player: [this.gameStore.prevName, Validators.required],
    size: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
    pits: [2, [Validators.required, Validators.min(1)]],
    arrows: [1, [Validators.required, Validators.min(1)]],
    selectedChar: [Chars.DEFAULT, [Validators.required]],
    difficulty: [DifficultyTypes.EASY, [Validators.required]],
  });

  ngOnInit(): void {
    this.gameEngine.syncSettingsWithStorage();
  }

  submitForm(): void {
    if (this.configForm.valid) {
      const difficulty = this.configForm.value.difficulty as DifficultyTypes;

      this.gameEngine.initGame({
        ...this.configForm.value,
        size: this.configForm.value.size + 3,
        blackout: this.applyBlackoutChance(),
        difficulty: DIFFICULTY_CONFIGS[difficulty],
      });
      this.goToStory();
    }
  }

  goToStory(): void {
    this.router.navigate([RouteTypes.STORY], {
      state: {fromSecretPath: true }
    });
  }

  selectChar(char: Chars): void {
    const matchingSound: GameSound = GameSound[char.toUpperCase() as keyof typeof GameSound];
    this.configForm.get('selectedChar')?.setValue(char);
    this.gameSound.stop();
    this.gameSound.playSound(matchingSound, false);
  }

  get difficultyDescription(): string {
    const diff: DifficultyTypes = this.configForm.get('difficulty')?.value;
    const config = DIFFICULTY_CONFIGS[diff];

    return ` ${config.maxLives} vidas, ${config.maxLevels} niveles, suerte: ${
      config.maxChance * 100
    }%`;
  }

  private applyBlackoutChance(): boolean {
    const blackoutChance = 0.13;
    return Math.random() < blackoutChance;
  }
}
