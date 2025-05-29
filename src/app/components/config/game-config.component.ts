import { ChangeDetectionStrategy, Component, inject, isDevMode, OnInit, effect, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
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
export class GameConfigComponent implements OnInit {
  readonly gameStore = inject(GameStore);
  private readonly gameEngine = inject(GameEngineService);
  private readonly fb = inject(FormBuilder);
  private readonly gameSound = inject(GameSoundService);
  private readonly router = inject(Router);
  private readonly translocoService = inject(TranslocoService);
  private readonly cdr = inject(ChangeDetectorRef);

  isDevMode = isDevMode();
  readonly configs = DIFFICULTY_CONFIGS as Record<string, GameDificulty>;

  configForm: FormGroup = this.fb.group({
    player: ['Kukuxumushu', Validators.required],
    size: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
    pits: [2, [Validators.required, Validators.min(1)]],
    arrows: [1, [Validators.required, Validators.min(1)]],
    selectedChar: [Chars.DEFAULT, [Validators.required]],
    difficulty: [DifficultyTypes.EASY, [Validators.required]],
  });

  constructor() {
    const gameSettingsSignal = this.gameStore.settings;

    effect(() => {
      const settings = gameSettingsSignal();
      if (settings && settings.size) { 
        this.configForm.patchValue({
          player: settings.player || 'Kukuxumushu',
          size: settings.size >= 4 ? settings.size - 3 : 1, 
          pits: settings.pits,
          arrows: settings.arrows,
          selectedChar: settings.selectedChar || Chars.DEFAULT,
          difficulty: this.getDifficultyTypeFromSettings(settings.difficulty),
        }, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
  }

  private getDifficultyTypeFromSettings(settingsDifficulty: unknown): DifficultyTypes {
    let difficultyToPatch: DifficultyTypes = DifficultyTypes.EASY;
    if (settingsDifficulty && 
        typeof settingsDifficulty === 'object' && 
        'label' in settingsDifficulty &&
        typeof (settingsDifficulty as { label: unknown }).label === 'string') {
        
        const settingsDiffLabel = (settingsDifficulty as { label: string }).label;

        const foundKey = Object.keys(DIFFICULTY_CONFIGS).find(key => {
            const configEntry = DIFFICULTY_CONFIGS[key as DifficultyTypes]; 
            return configEntry.label === settingsDiffLabel;
        });

        if (foundKey) {
            difficultyToPatch = foundKey as DifficultyTypes;
        }
    }
    return difficultyToPatch;
  }

  submitForm(): void {
    if (this.configForm.valid) {
      const difficulty = this.configForm.value.difficulty as DifficultyTypes;

      this.gameEngine.initGame({
        ...this.configForm.value,
        size: this.configForm.value.size + 3,
        blackout: false,
        difficulty: DIFFICULTY_CONFIGS[difficulty],
        startTime: new Date().toISOString(),
      });
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
