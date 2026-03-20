import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Game } from './game';
import { RouterModule } from '@angular/router';
import { GAME_STORE_TOKEN, GAME_SOUND_TOKEN } from '@hunt-the-bishomalo/core/api';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';
import { signal } from '@angular/core';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { LEADERBOARD_SERVICE } from '@hunt-the-bishomalo/gamestats/api';
import { GAME_ENGINE_TOKEN } from '@hunt-the-bishomalo/game/api';
import { AchieveTypes } from '@hunt-the-bishomalo/data';

describe('Game', () => {
  let component: Game;
  let fixture: ComponentFixture<Game>;

  const ACHIEVEMENT_SERVICE_MOCK = {
    activeAchievement: jest.fn(),
    calcVictoryAchieve: jest.fn(),
    handleWumpusKillAchieve: jest.fn(),
    isAllCompleted: jest.fn(),
    completed: signal(undefined),
    achievements: [],
  };

  const GAME_ENGINE_MOCK = {
    newGame: jest.fn(),
    initGame: jest.fn(),
    moveForward: jest.fn(),
    turnLeft: jest.fn(),
    turnRight: jest.fn(),
    shootArrow: jest.fn(),
  };

  const GAME_SOUND_MOCK = {
    playSound: jest.fn(),
  };

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
    wumpusKilled: signal(0),
    blackout: signal(false),
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
        { provide: GAME_STORE_TOKEN, useValue: mockGameStore },
        { provide: LEADERBOARD_SERVICE, useValue: { clear: jest.fn() } },
        { provide: ACHIEVEMENT_SERVICE, useValue: ACHIEVEMENT_SERVICE_MOCK },
        { provide: GAME_ENGINE_TOKEN, useValue: GAME_ENGINE_MOCK },
        { provide: GAME_SOUND_TOKEN, useValue: GAME_SOUND_MOCK },
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

  describe('side effects and actions', () => {
    it('should trigger blackout achievement', () => {
        mockGameStore.settings.set({ blackout: true, difficulty: { maxLives: 3 } });
        mockGameStore.isAlive.set(true);
        mockGameStore.hasWon.set(false);
        TestBed.flushEffects();
        expect(ACHIEVEMENT_SERVICE_MOCK.activeAchievement).toHaveBeenCalledWith(AchieveTypes.BLACKOUT);
    });

    it('should trigger penta achievement', () => {
        mockGameStore.wumpusKilled.set(5);
        TestBed.flushEffects();
        expect(ACHIEVEMENT_SERVICE_MOCK.activeAchievement).toHaveBeenCalledWith(AchieveTypes.PENTA);
    });

    it('should trigger death achievement on game over', () => {
        mockGameStore.isAlive.set(false);
        mockGameStore.blackout.set(false);
        TestBed.flushEffects();
        expect(ACHIEVEMENT_SERVICE_MOCK.activeAchievement).toHaveBeenCalledWith(AchieveTypes.LASTBREATH);
    });

    it('should call engine actions', () => {
        component.handleNewGame();
        expect(GAME_ENGINE_MOCK.newGame).toHaveBeenCalled();

        component.handleRestart();
        expect(GAME_ENGINE_MOCK.initGame).toHaveBeenCalled();

        component.handleMoveForward();
        expect(GAME_ENGINE_MOCK.moveForward).toHaveBeenCalled();

        component.handleTurnLeft();
        expect(GAME_ENGINE_MOCK.turnLeft).toHaveBeenCalled();

        component.handleTurnRight();
        expect(GAME_ENGINE_MOCK.turnRight).toHaveBeenCalled();

        component.handleShootArrow();
        expect(GAME_ENGINE_MOCK.shootArrow).toHaveBeenCalled();

        component.handleMobileShootArrow();
        expect(GAME_ENGINE_MOCK.shootArrow).toHaveBeenCalled();
        expect(ACHIEVEMENT_SERVICE_MOCK.activeAchievement).toHaveBeenCalledWith(AchieveTypes.GAMER);
    });
  });
});
