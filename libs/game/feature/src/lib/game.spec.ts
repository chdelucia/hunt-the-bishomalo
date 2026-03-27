import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Game } from './game';
import { RouterModule } from '@angular/router';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';
import { signal } from '@angular/core';
import { GAME_FACADE_TOKEN } from '@hunt-the-bishomalo/game/api';

describe('Game', () => {
  let component: Game;
  let fixture: ComponentFixture<Game>;

  const mockGameFacade = {
    board: signal([]),
    isAlive: signal(true),
    hasWon: signal(false),
    settings: signal({
      blackout: false,
      size: 4,
      difficulty: {
        maxLives: 3,
        maxLevels: 10,
      },
      selectedChar: 'default',
    }),
    message: signal(''),
    lives: signal(3),
    currentCell: signal(null),
    inventory: signal([]),
    wumpusKilled: signal(0),
    soundEnabled: signal(true),
    dragonballs: signal(0),
    gold: signal(0),
    hunter: signal({
      direction: 0,
      arrows: 1,
      hasGold: false,
    }),
    blackout: signal(false),
    newGame: jest.fn(),
    shootArrow: jest.fn(),
    moveForward: jest.fn(),
    turnLeft: jest.fn(),
    turnRight: jest.fn(),
    toggleSound: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Game, RouterModule.forRoot([]), getTranslocoTestingModule()],
      providers: [{ provide: GAME_FACADE_TOKEN, useValue: mockGameFacade }],
    }).compileComponents();

    fixture = TestBed.createComponent(Game);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute deathByWumpus correctly', () => {
    mockGameFacade.message.set('¡El Wumpus te devoró!');
    fixture.detectChanges();
    expect(component.deathByWumpus()).toBe(true);

    mockGameFacade.message.set('Something else');
    fixture.detectChanges();
    expect(component.deathByWumpus()).toBe(false);
  });

  it('should handle close and call newGame', () => {
    component.handleclose();
    expect(mockGameFacade.newGame).toHaveBeenCalled();
  });

  it('should call facade shootArrow on mobile shoot', () => {
    component.handleMobileShootArrow();
    expect(mockGameFacade.shootArrow).toHaveBeenCalled();
  });
});
