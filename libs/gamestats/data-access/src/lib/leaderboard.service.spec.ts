import { TestBed } from '@angular/core/testing';
import { LeaderboardService } from './leaderboard.service';
import { GameStore } from '@hunt-the-bishomalo/core/store';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { LocalstorageService } from '@hunt-the-bishomalo/core/services';
import { signal, WritableSignal } from '@angular/core';

describe('LeaderboardService', () => {
  let service: LeaderboardService;
  let mockGameStore: any;
  let mockAchievementService: any;
  let mockLocalStorageService: any;

  let hasWonSignal: WritableSignal<boolean>;
  let isAliveSignal: WritableSignal<boolean>;
  let hunterSignal: WritableSignal<{ x: number; y: number }>;
  let settingsSignal: WritableSignal<any>;
  let wumpusKilledSignal: WritableSignal<number>;
  let startTimeSignal: WritableSignal<string>;

  beforeEach(() => {
    hasWonSignal = signal(false);
    isAliveSignal = signal(true);
    hunterSignal = signal({ x: 0, y: 0 });
    settingsSignal = signal({ player: 'TestPlayer', blackout: false, size: 4 });
    wumpusKilledSignal = signal(0);
    startTimeSignal = signal(new Date().toISOString());

    mockGameStore = {
      hasWon: hasWonSignal,
      isAlive: isAliveSignal,
      hunter: hunterSignal,
      settings: settingsSignal,
      wumpusKilled: wumpusKilledSignal,
      startTime: startTimeSignal,
    };

    mockAchievementService = {
      calcVictoryAchieve: jest.fn(),
    };

    mockLocalStorageService = {
      getValue: jest.fn().mockReturnValue([]),
      setValue: jest.fn(),
      clearValue: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        LeaderboardService,
        { provide: GameStore, useValue: mockGameStore },
        { provide: ACHIEVEMENT_SERVICE, useValue: mockAchievementService },
        { provide: LocalstorageService, useValue: mockLocalStorageService },
      ],
    });

    service = TestBed.inject(LeaderboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load leaderboard from storage on init', () => {
    expect(mockLocalStorageService.getValue).toHaveBeenCalledWith('hunt_the_bishomalo_leaderboard');
  });

  it('should add entry when player wins', () => {
    const startTime = new Date();
    startTime.setSeconds(startTime.getSeconds() - 10);
    startTimeSignal.set(startTime.toISOString());

    // Trigger winning state
    TestBed.flushEffects(); // Ensure constructor effects are ready

    hasWonSignal.set(true);
    TestBed.flushEffects();

    expect(service._leaderboard.length).toBe(1);
    expect(service._leaderboard[0].playerName).toBe('TestPlayer');
    expect(service._leaderboard[0].timeInSeconds).toBeGreaterThanOrEqual(10);
    expect(mockLocalStorageService.setValue).toHaveBeenCalled();
    expect(mockAchievementService.calcVictoryAchieve).toHaveBeenCalled();
  });

  it('should add entry when player dies', () => {
    isAliveSignal.set(false);
    TestBed.flushEffects();

    expect(service._leaderboard.length).toBe(1);
    expect(service._leaderboard[0].deads).toBe(1);
    expect(mockLocalStorageService.setValue).toHaveBeenCalled();
  });

  it('should count steps when hunter moves', () => {
    hunterSignal.set({ x: 1, y: 0 });
    TestBed.flushEffects();
    hunterSignal.set({ x: 1, y: 1 });
    TestBed.flushEffects();

    isAliveSignal.set(false);
    TestBed.flushEffects();

    expect(service._leaderboard[0].steps).toBe(2);
  });

  it('should clear leaderboard', () => {
    service.clear();
    expect(mockLocalStorageService.clearValue).toHaveBeenCalledWith('hunt_the_bishomalo_leaderboard');
    expect(service._leaderboard).toEqual([]);
  });
});
