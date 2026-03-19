import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameConfigComponent } from './game-config.component';
import { ReactiveFormsModule } from '@angular/forms';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';
import { GameSoundService } from '@hunt-the-bishomalo/core/services';
import { GAME_ENGINE_TOKEN } from '@hunt-the-bishomalo/game/api';
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/store';
import { provideRouter, Router } from '@angular/router';
import { Chars, DifficultyTypes, RouteTypes, GameSound } from '@hunt-the-bishomalo/data';

const mockGameEngine = {
  initGame: jest.fn(),
};

const mockGameSound = {
  playSound: jest.fn(),
  stop: jest.fn(),
};

describe('GameConfigComponent', () => {
  let component: GameConfigComponent;
  let fixture: ComponentFixture<GameConfigComponent>;
  let router: Router;
  let gameStore: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameConfigComponent, ReactiveFormsModule, getTranslocoTestingModule()],
      providers: [
        { provide: GAME_ENGINE_TOKEN, useValue: mockGameEngine },
        { provide: GameSoundService, useValue: mockGameSound },
        {
          provide: GAME_STORE_TOKEN,
          useValue: {
            updateGame: jest.fn(),
            unlockedChars: jest.fn().mockReturnValue([]),
          },
        },
        provideRouter([
          { path: RouteTypes.STORY, redirectTo: '' },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameConfigComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    gameStore = TestBed.inject(GAME_STORE_TOKEN);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default form values', () => {
    expect(component.configForm.value).toEqual({
      player: 'Kukuxumushu',
      size: 1,
      selectedChar: Chars.DEFAULT,
      difficulty: DifficultyTypes.EASY,
    });
  });

  it('should not submit if form is invalid', () => {
    component.configForm.patchValue({ player: '' });
    component.submitForm();
    expect(mockGameEngine.initGame).not.toHaveBeenCalled();
  });

  it('should be invalid if player name exceeds 20 characters', () => {
    component.configForm.patchValue({ player: 'a'.repeat(21) });
    expect(component.configForm.get('player')?.valid).toBeFalsy();
    expect(component.configForm.get('player')?.hasError('maxlength')).toBeTruthy();
  });

  it('should be invalid if player name contains prohibited characters', () => {
    component.configForm.patchValue({ player: 'Player!@#' });
    expect(component.configForm.get('player')?.valid).toBeFalsy();
    expect(component.configForm.get('player')?.hasError('pattern')).toBeTruthy();
  });

  it('should be valid with alphanumeric characters, spaces, hyphens and underscores', () => {
    component.configForm.patchValue({ player: 'Player 1-abc_XYZ' });
    expect(component.configForm.get('player')?.valid).toBeTruthy();
  });

  it('should submit and navigate if form is valid', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const updateGameSpy = jest.spyOn(gameStore, 'updateGame');

    component.submitForm();

    expect(updateGameSpy).toHaveBeenCalled();
    expect(mockGameEngine.initGame).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith([RouteTypes.STORY], {
      state: { fromSecretPath: true },
    });
  });

  it('should select character and play sound', () => {
    component.selectChar(Chars.LINK);
    expect(component.configForm.get('selectedChar')?.value).toBe(Chars.LINK);
    expect(mockGameSound.stop).toHaveBeenCalled();
    expect(mockGameSound.playSound).toHaveBeenCalledWith(GameSound.LINK, false);
  });

  it('should navigate to story', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.goToStory();
    expect(navigateSpy).toHaveBeenCalledWith([RouteTypes.STORY], {
      state: { fromSecretPath: true },
    });
  });
});
