import { TestBed } from '@angular/core/testing';
import { GameFacade } from './game.facade';
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { GAME_ENGINE_TOKEN } from '@hunt-the-bishomalo/game/api';
import { signal } from '@angular/core';

describe('GameFacade', () => {
  let facade: GameFacade;
  let storeMock: any;
  let engineMock: any;

  beforeEach(() => {
    storeMock = {
      board: signal([]),
      isAlive: signal(true),
      hasWon: signal(false),
      settings: signal({}),
      message: signal(''),
      lives: signal(3),
      currentCell: signal(null),
      inventory: signal([]),
      wumpusKilled: signal(0),
      soundEnabled: signal(true),
      dragonballs: signal(0),
      gold: signal(0),
      hunter: signal({}),
      blackout: signal(false),
      toggleSound: jest.fn(),
    };

    engineMock = {
      moveForward: jest.fn(),
      turnLeft: jest.fn(),
      turnRight: jest.fn(),
      shootArrow: jest.fn(),
      newGame: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        GameFacade,
        { provide: GAME_STORE_TOKEN, useValue: storeMock },
        { provide: GAME_ENGINE_TOKEN, useValue: engineMock },
      ],
    });
    facade = TestBed.inject(GameFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should delegate moveForward to engine', () => {
    facade.moveForward();
    expect(engineMock.moveForward).toHaveBeenCalled();
  });

  it('should delegate toggleSound to store', () => {
    facade.toggleSound();
    expect(storeMock.toggleSound).toHaveBeenCalled();
  });

  it('should return deathByWumpus true when message is "¡El Wumpus te devoró!"', () => {
    storeMock.message.set('¡El Wumpus te devoró!');
    expect(facade.deathByWumpus()).toBe(true);
  });

  it('should return deathByWumpus false when message is different', () => {
    storeMock.message.set('Other message');
    expect(facade.deathByWumpus()).toBe(false);
  });

  it('should delegate turnLeft to engine', () => {
    facade.turnLeft();
    expect(engineMock.turnLeft).toHaveBeenCalled();
  });

  it('should delegate turnRight to engine', () => {
    facade.turnRight();
    expect(engineMock.turnRight).toHaveBeenCalled();
  });

  it('should delegate shootArrow to engine', () => {
    facade.shootArrow();
    expect(engineMock.shootArrow).toHaveBeenCalled();
  });

  it('should delegate newGame to engine', () => {
    facade.newGame();
    expect(engineMock.newGame).toHaveBeenCalled();
  });
});
