import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameConfigComponent } from './game-config.component';
import { GameEngineService, GameSoundService } from 'src/app/services';
import { Chars } from 'src/app/models';
import { getTranslocoTestingModule } from 'src/app/utils';
import { GameStore } from 'src/app/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const gameEngineServiceMock = {
  initGame: jest.fn(),
  syncSettingsWithStorage: jest.fn(),
};

const gameSoundMock = {
  playSound: jest.fn(),
  stop: jest.fn(),
};

const gameStoreMock = {
  updateGame: jest.fn(),
  hunter: jest.fn().mockReturnValue({ chars: [] }),
  unlockedChars: jest.fn()
};

describe('GameConfigComponent', () => {
  let component: GameConfigComponent;
  let fixture: ComponentFixture<GameConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameConfigComponent, getTranslocoTestingModule()],
      providers: [
        { provide: GameEngineService, useValue: gameEngineServiceMock },
        { provide: GameSoundService, useValue: gameSoundMock },
        { provide: GameStore, useValue: gameStoreMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    jest.clearAllMocks();
    fixture = TestBed.createComponent(GameConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    const form = component.configForm;
    expect(form.value).toEqual({
      player: 'Kukuxumushu',
      size: 1,
      selectedChar: 'default',
      difficulty: 'easy',
    });
  });

  it('should mark form as invalid if required fields are empty or invalid', () => {
    component.configForm.patchValue({ player: '', size: 2, pits: 0, arrows: 0 });
    expect(component.configForm.valid).toBe(false);
  });

  it('should call initGame with form values when form is valid', () => {
    component.configForm.setValue({
      player: 'Ana',
      size: 9,
      selectedChar: 'default',
      difficulty: 'easy',
    });

    component.submitForm();
    expect(gameStoreMock.updateGame).toHaveBeenCalledWith({
      settings: {
        player: 'Ana',
        size: 12,
        blackout: expect.any(Boolean),
        selectedChar: 'default',
        difficulty: {
          baseChance: 0.12,
          gold: 60,
          luck: 8,
          maxChance: 0.35,
          maxLevels: 10,
          maxLives: 8,
          bossTries: 12,
        },
        startTime: expect.any(String),
      },
      lives: 8,
    });
    expect(gameEngineServiceMock.initGame).toHaveBeenCalledWith();
  });

  it('should NOT call initGame when form is invalid', () => {
    component.configForm.setValue({
      player: '',
      size: 3,
      selectedChar: 'default',
      difficulty: {
        baseChance: 0.12,
        gold: 60,
        luck: 8,
        maxChance: 0.35,
        maxLevels: 10,
        maxLives: 8,
        bossTries: 12,
      },
    });

    component.submitForm();
    expect(gameEngineServiceMock.initGame).not.toHaveBeenCalled();
  });

  it('should select char', () => {
    component.selectChar(Chars.LARA);
    expect(gameSoundMock.stop).toHaveBeenCalled();
    expect(gameSoundMock.playSound).toHaveBeenCalledWith(Chars.LARA, false);
    expect(component.configForm.get('selectedChar')?.value).toBe(Chars.LARA);
  });
});
