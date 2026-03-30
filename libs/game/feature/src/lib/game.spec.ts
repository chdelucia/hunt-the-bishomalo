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
    deathByWumpus: signal(false),
    hasGold: signal(false),
    newGame: jest.fn(),
    initGame: jest.fn(),
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

  it('should return deathByWumpus from facade', () => {
    mockGameFacade.deathByWumpus.set(true);
    fixture.detectChanges();
    expect(component.facade.deathByWumpus()).toBe(true);

    mockGameFacade.deathByWumpus.set(false);
    fixture.detectChanges();
    expect(component.facade.deathByWumpus()).toBe(false);
  });

  it('should handle close and call newGame when lives are 0', () => {
    mockGameFacade.lives.set(0);
    component.handleClose();
    expect(mockGameFacade.newGame).toHaveBeenCalled();
  });

  it('should call initGame when lives > 0', () => {
    jest.clearAllMocks();
    mockGameFacade.lives.set(3);
    component.handleClose();
    expect(mockGameFacade.initGame).toHaveBeenCalled();
    expect(mockGameFacade.newGame).not.toHaveBeenCalled();
  });

  it('should call facade shootArrow on mobile shoot', () => {
    component.handleMobileShootArrow();
    expect(mockGameFacade.shootArrow).toHaveBeenCalled();
  });
});
