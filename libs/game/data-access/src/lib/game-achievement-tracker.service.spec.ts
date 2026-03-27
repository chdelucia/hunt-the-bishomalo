import { TestBed } from '@angular/core/testing';
import { GameAchievementTrackerService } from './game-achievement-tracker.service';
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { signal } from '@angular/core';
import { AchieveTypes } from '@hunt-the-bishomalo/shared-data';

describe('GameAchievementTrackerService', () => {
  let service: GameAchievementTrackerService;
  let storeMock: any;
  let achievementMock: any;

  beforeEach(() => {
    storeMock = {
      wumpusKilled: signal(0),
      hunter: signal({ arrows: 1, x: 0, y: 0 }),
      settings: signal({ blackout: false, size: 5, pits: 1 }),
      board: signal([]),
    };

    achievementMock = {
      activeAchievement: jest.fn(),
      isAllCompleted: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        GameAchievementTrackerService,
        { provide: GAME_STORE_TOKEN, useValue: storeMock },
        { provide: ACHIEVEMENT_SERVICE, useValue: achievementMock },
      ],
    });
    service = TestBed.inject(GameAchievementTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call activeAchievement', () => {
    service.activeAchievement(AchieveTypes.GAMER);
    expect(achievementMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.GAMER);
  });

  it('should calculate victory achievements correctly', () => {
    service.calcVictoryAchieve(5);
    expect(achievementMock.isAllCompleted).toHaveBeenCalled();
  });
});
