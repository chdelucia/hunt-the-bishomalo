import { TestBed } from '@angular/core/testing';
import { GameStatsTrackerService } from './game-stats-tracker.service';
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { LEADERBOARD_SERVICE } from '@hunt-the-bishomalo/gamestats/api';
import { GAME_ACHIEVEMENT_TRACKER_TOKEN } from '@hunt-the-bishomalo/game/api';
import { signal } from '@angular/core';

describe('GameStatsTrackerService', () => {
  let service: GameStatsTrackerService;
  let storeMock: any;
  let leaderboardMock: any;
  let achievementTrackerMock: any;

  beforeEach(() => {
    storeMock = {
      hasWon: signal(false),
      isAlive: signal(true),
      hunter: signal({ x: 0, y: 0 }),
      settings: signal({ player: 'Test', size: 5 }),
      startTime: signal(new Date().toISOString()),
      wumpusKilled: signal(0),
    };

    leaderboardMock = {
      addEntry: jest.fn(),
    };

    achievementTrackerMock = {
      calcVictoryAchieve: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        GameStatsTrackerService,
        { provide: GAME_STORE_TOKEN, useValue: storeMock },
        { provide: LEADERBOARD_SERVICE, useValue: leaderboardMock },
        { provide: GAME_ACHIEVEMENT_TRACKER_TOKEN, useValue: achievementTrackerMock },
      ],
    });
    service = TestBed.inject(GameStatsTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should track steps when hunter moves', () => {
    storeMock.hunter.set({ x: 1, y: 0 });
    service.trackSteps();
    storeMock.hasWon.set(true);
    service.handleGameOver();
    expect(leaderboardMock.addEntry).toHaveBeenCalledWith(expect.objectContaining({ steps: 1 }));
  });
});
