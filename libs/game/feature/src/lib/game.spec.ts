import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Game } from './game';
import { RouterModule } from '@angular/router';
import { GameStore } from '@hunt-the-bishomalo/core/store';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';
import { signal } from '@angular/core';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { LEADERBOARD_SERVICE } from '@hunt-the-bishomalo/gamestats/api';
import { GameEngineService } from '@hunt-the-bishomalo/game/data-access';

describe('Game', () => {
  let component: Game;
  let fixture: ComponentFixture<Game>;

  const mockGameStore = {
    board: signal([]),
    isAlive: signal(true),
    hasWon: signal(false),
    settings: signal({
        blackout: false,
        size: 4,
        difficulty: {
            maxLives: 3
        }
    }),
    message: signal(''),
    lives: signal(3),
    hasGold: signal(false),
    currentCell: signal(undefined),
    inventory: signal([]),
    hunter: signal({
        direction: 0,
        arrows: 1,
        hasGold: false,
    }),
    setMessage: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Game, RouterModule.forRoot([]), getTranslocoTestingModule()],
      providers: [
        { provide: GameStore, useValue: mockGameStore },
        { provide: LEADERBOARD_SERVICE, useValue: { clear: jest.fn() } },
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
        GameEngineService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Game);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute deathByWumpus correctly', () => {
    mockGameStore.message.set('¡El Wumpus te devoró!');
    fixture.detectChanges();
    expect(component.deathByWumpus()).toBe(true);

    mockGameStore.message.set('Something else');
    fixture.detectChanges();
    expect(component.deathByWumpus()).toBe(false);
  });

  it('should handle close and set message', () => {
    mockGameStore.message.set('You died');
    component.handleclose();
    expect(mockGameStore.setMessage).toHaveBeenCalledWith('GAME OVER You died');
  });
});
