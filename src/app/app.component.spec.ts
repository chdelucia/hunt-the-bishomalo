import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { LEADERBOARD_SERVICE } from '@hunt-the-bishomalo/gamestats/api';
import { KeyboardManagerService } from '@hunt-the-bishomalo/game/data-access';
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/store';
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
        { provide: KeyboardManagerService, useValue: { handleKeyDown: jest.fn() } },
        {
          provide: GAME_STORE_TOKEN,
          useValue: {
            settings: signal({ size: 4, difficulty: { luck: 5 } }),
            hunter: signal({ x: 0, y: 0 }),
            lives: signal(3),
            dragonballs: signal(0),
            board: signal([]),
            message: signal(''),
            isAlive: signal(true),
            hasWon: signal(false),
            syncHunterWithStorage: jest.fn(),
          },
        },
        { provide: GAME_ENGINE_TOKEN, useValue: {} },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`should have as title 'hunt-the-bishomalo'`, () => {
    expect(component.title).toEqual('hunt-the-bishomalo');
  });
});
