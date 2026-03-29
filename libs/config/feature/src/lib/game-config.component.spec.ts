import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameConfigComponent } from './game-config.component';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';
import { GAME_SOUND_TOKEN, GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { GAME_ENGINE_TOKEN } from '@hunt-the-bishomalo/game/api';
import { provideRouter, Router } from '@angular/router';
import { Chars, DifficultyTypes, RouteTypes, GameSound } from '@hunt-the-bishomalo/shared-data';
import { signal } from '@angular/core';

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
      imports: [GameConfigComponent, getTranslocoTestingModule()],
      providers: [
        { provide: GAME_ENGINE_TOKEN, useValue: mockGameEngine },
        { provide: GAME_SOUND_TOKEN, useValue: mockGameSound },
        {
          provide: GAME_STORE_TOKEN,
          useValue: {
            updateGame: jest.fn(),
            unlockedChars: jest.fn().mockReturnValue([]),
            soundEnabled: signal(true),
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
    expect(component.model()).toEqual({
      player: 'Kukuxumushu',
      size: 1,
      selectedChar: Chars.DEFAULT,
      difficulty: DifficultyTypes.EASY,
    });
  });

  it('should not submit if form is invalid', () => {
    component.model.update(m => ({ ...m, player: '' }));
    fixture.detectChanges();
    component.submitForm();
    expect(mockGameEngine.initGame).not.toHaveBeenCalled();
  });

  it('should be invalid if player name exceeds 20 characters', () => {
    component.model.update(m => ({ ...m, player: 'a'.repeat(21) }));
    fixture.detectChanges();
    expect(component.configForm.player().valid()).toBeFalsy();
    expect(component.configForm.player().errors()[0].kind).toBe('maxLength');
  });

  it('should be invalid if player name contains prohibited characters', () => {
    component.model.update(m => ({ ...m, player: 'Player!@#' }));
    fixture.detectChanges();
    expect(component.configForm.player().valid()).toBeFalsy();
    expect(component.configForm.player().errors()[0].kind).toBe('pattern');
  });

  it('should be valid with alphanumeric characters, spaces, hyphens and underscores', () => {
    component.model.update(m => ({ ...m, player: 'Player 1-abc_XYZ' }));
    fixture.detectChanges();
    expect(component.configForm.player().valid()).toBeTruthy();
  });

  it('should submit and navigate if form is valid', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const updateGameSpy = jest.spyOn(gameStore, 'updateGame');

    component.submitForm();

    setTimeout(() => {
      expect(updateGameSpy).toHaveBeenCalled();
      expect(mockGameEngine.initGame).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith([RouteTypes.STORY], {
        state: { fromSecretPath: true },
      });
    });
  });

  it('should select character and play sound', () => {
    component.selectChar(Chars.LINK);
    expect(component.model().selectedChar).toBe(Chars.LINK);
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
