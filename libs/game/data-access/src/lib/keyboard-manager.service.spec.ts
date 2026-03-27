import { TestBed } from '@angular/core/testing';
import { KeyboardManagerService } from './keyboard-manager.service';
import { Router } from '@angular/router';
import { GAME_ENGINE_TOKEN, GAME_ACHIEVEMENT_TRACKER_TOKEN } from '@hunt-the-bishomalo/game/api';
import { RouteTypes, AchieveTypes } from '@hunt-the-bishomalo/shared-data';

describe('KeyboardManagerService', () => {
  let service: KeyboardManagerService;
  let gameMock: any;
  let achievementTrackerMock: any;
  let routerMock: any;

  beforeEach(() => {
    gameMock = {
      moveForward: jest.fn(),
      shootArrow: jest.fn(),
      turnLeft: jest.fn(),
      turnRight: jest.fn(),
      initGame: jest.fn(),
      newGame: jest.fn(),
    };
    achievementTrackerMock = {
      activeAchievement: jest.fn(),
    };
    routerMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        KeyboardManagerService,
        { provide: GAME_ENGINE_TOKEN, useValue: gameMock },
        { provide: GAME_ACHIEVEMENT_TRACKER_TOKEN, useValue: achievementTrackerMock },
        { provide: Router, useValue: routerMock },
      ],
    });
    service = TestBed.inject(KeyboardManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle ArrowUp key', () => {
    const event = new KeyboardEvent('keydown', { code: 'ArrowUp' });
    service.handleKeyDown(event);
    expect(gameMock.moveForward).toHaveBeenCalled();
  });

  it('should handle KeyW and grant achievement', () => {
    const event = new KeyboardEvent('keydown', { code: 'KeyW' });
    service.handleKeyDown(event);
    expect(gameMock.moveForward).toHaveBeenCalled();
    expect(achievementTrackerMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.GAMER);
  });

  it('should handle ArrowLeft and turnLeft', () => {
    const event = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
    service.handleKeyDown(event);
    expect(gameMock.turnLeft).toHaveBeenCalled();
  });

  it('should handle ArrowRight and turnRight', () => {
    const event = new KeyboardEvent('keydown', { code: 'ArrowRight' });
    service.handleKeyDown(event);
    expect(gameMock.turnRight).toHaveBeenCalled();
  });

  it('should handle Space/Enter and shootArrow', () => {
    const eventSpace = new KeyboardEvent('keydown', { code: 'Space' });
    service.handleKeyDown(eventSpace);
    expect(gameMock.shootArrow).toHaveBeenCalledTimes(1);

    const eventEnter = new KeyboardEvent('keydown', { code: 'Enter' });
    service.handleKeyDown(eventEnter);
    expect(gameMock.shootArrow).toHaveBeenCalledTimes(2);
  });

  it('should handle KeyA and turnLeft', () => {
    const event = new KeyboardEvent('keydown', { code: 'KeyA' });
    service.handleKeyDown(event);
    expect(gameMock.turnLeft).toHaveBeenCalled();
  });

  it('should handle KeyD and turnRight', () => {
    const event = new KeyboardEvent('keydown', { code: 'KeyD' });
    service.handleKeyDown(event);
    expect(gameMock.turnRight).toHaveBeenCalled();
  });

  it('should handle KeyN and start new game', () => {
    const event = new KeyboardEvent('keydown', { code: 'KeyN' });
    service.handleKeyDown(event);
    expect(gameMock.newGame).toHaveBeenCalled();
  });

  it('should handle KeyI and navigate to rules', () => {
    const event = new KeyboardEvent('keydown', { code: 'KeyI' });
    service.handleKeyDown(event);
    expect(routerMock.navigate).toHaveBeenCalledWith([RouteTypes.RULES]);
  });
});
