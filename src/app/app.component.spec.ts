import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';
import { LEADERBOARD_SERVICE } from '@hunt-the-bishomalo/gamestats/api';
import { KeyboardManagerService } from '@hunt-the-bishomalo/game/data-access';
import {
  GAME_STORE_TOKEN,
  LOCALSTORAGE_SERVICE_TOKEN,
  GAME_SOUND_TOKEN,
  GAME_EVENT_SERVICE_TOKEN,
  ACHIEVEMENT_SERVICE,
} from '@hunt-the-bishomalo/core/api';
import { GAME_ENGINE_TOKEN } from '@hunt-the-bishomalo/game/api';
import { signal } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterModule.forRoot([]), getTranslocoTestingModule()],
      providers: [
        {
          provide: ACHIEVEMENT_SERVICE,
          useValue: {
            activeAchievement: jest.fn(),
            calcVictoryAchieve: jest.fn(),
            handleWumpusKillAchieve: jest.fn(),
            isAllCompleted: jest.fn(),
            completed: signal(undefined),
            achievements: [],
          },
        },
        { provide: LEADERBOARD_SERVICE, useValue: { clear: jest.fn() } },
        {
          provide: LOCALSTORAGE_SERVICE_TOKEN,
          useValue: { getValue: jest.fn(), setValue: jest.fn() },
        },
        { provide: GAME_SOUND_TOKEN, useValue: { stop: jest.fn(), playSound: jest.fn() } },
        {
          provide: GAME_EVENT_SERVICE_TOKEN,
          useValue: { applyEffectsOnDeath: jest.fn(), applyEffectByCellContent: jest.fn() },
        },
        { provide: KeyboardManagerService, useValue: { handleKeyDown: jest.fn() } },
        {
          provide: GAME_STORE_TOKEN,
          useValue: {
            size: signal(4),
            soundEnabled: signal(true),
            settings: signal({ size: 4, difficulty: { luck: 5 } }),
            hunter: signal({ x: 0, y: 0, direction: 0, arrows: 1 }),
            lives: signal(3),
            dragonballs: signal(0),
            board: signal([]),
            message: signal(''),
            isAlive: signal(true),
            hasWon: signal(false),
            syncHunterWithStorage: jest.fn(),
            resetStore: jest.fn(),
            updateGame: jest.fn(),
            updateHunter: jest.fn(),
            setMessage: jest.fn(),
            countWumpusKilled: jest.fn(),
          },
        },
        {
          provide: GAME_ENGINE_TOKEN,
          useValue: {
            newGame: jest.fn(),
            initGame: jest.fn(),
            moveForward: jest.fn(),
            turnLeft: jest.fn(),
            turnRight: jest.fn(),
            shootArrow: jest.fn(),
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`should have as title 'hunt-the-bishomalo'`, () => {
    expect(component.title).toEqual('hunt-the-bishomalo');
  });

  it('should handle keyboard events', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    const keyboardManager = TestBed.inject(KeyboardManagerService);
    component.handleKeyDown(event);
    expect(keyboardManager.handleKeyDown).toHaveBeenCalledWith(event);
  });

  it('should have gameEngine and game store injected', () => {
    expect(component.gameEngine).toBeDefined();
    expect(component.game).toBeDefined();
  });
});
