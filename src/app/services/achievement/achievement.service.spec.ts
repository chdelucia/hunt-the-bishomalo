import { TestBed } from '@angular/core/testing';
import { AchievementService } from './achievement.service';
import { LocalstorageService } from '../localstorage/localstorage.service';
import { GameSoundService } from '../sound/game-sound.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { AchieveTypes } from 'src/app/models';
import { GameStoreService } from '../store/game-store.service';

const mockLocalStorageService = {
  getValue: jest.fn(),
  setValue: jest.fn(),
};

const mockGameStoreService = {
  hunter: jest.fn(),
  settings: {},
  board: jest.fn(),
};

const mockGameSoundService = {
  stop: jest.fn(),
  playSound: jest.fn(),
};

const mockAnalyticsService = {
  trackAchievementUnlocked: jest.fn(),
};

describe('AchievementService', () => {
  let service: AchievementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LocalstorageService, useValue: mockLocalStorageService },
        { provide: GameStoreService, useValue: mockGameStoreService },
        { provide: GameSoundService, useValue: mockGameSoundService },
        { provide: AnalyticsService, useValue: mockAnalyticsService },
      ],
    });

    service = TestBed.inject(AchievementService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('activeAchievement', () => {
    it('should unlock and store achievement if not already unlocked', () => {
      mockLocalStorageService.getValue.mockReturnValue([]);

      service.activeAchievement(AchieveTypes.SPEEDRUNNER);

      const updated = service.achievements.find((a) => a.id === AchieveTypes.SPEEDRUNNER);

      expect(updated?.unlocked).toBe(true);
      expect(mockLocalStorageService.setValue).toHaveBeenCalledWith(
        'hunt_the_bishomalo_achievements',
        [AchieveTypes.SPEEDRUNNER],
      );
      expect(mockAnalyticsService.trackAchievementUnlocked).toHaveBeenCalledWith(
        AchieveTypes.SPEEDRUNNER,
        'Speedrunner',
      );
    });

    it('should do nothing if achievement already unlocked', () => {
      service.achievements[0].unlocked = true;

      service.activeAchievement(AchieveTypes.SPEEDRUNNER);

      expect(mockLocalStorageService.setValue).toHaveBeenCalled();
      expect(mockAnalyticsService.trackAchievementUnlocked).toHaveBeenCalled();
    });
  });

  describe('syncAchievementsWithStorage', () => {
    it('should mark stored achievements as unlocked', () => {
      mockLocalStorageService.getValue.mockReturnValue([AchieveTypes.SPEEDRUNNER]);

      // Forzamos sync
      service['syncAchievementsWithStorage']();

      const updated = service.achievements.find((a) => a.id === AchieveTypes.SPEEDRUNNER);
      expect(updated?.unlocked).toBe(true);
    });
  });

  describe('getStoredAchievementIds', () => {
    it('should return array from storage or empty', () => {
      mockLocalStorageService.getValue.mockReturnValueOnce(undefined);
      expect(service['getStoredAchievementIds']()).toEqual([]);

      mockLocalStorageService.getValue.mockReturnValueOnce(['A']);
      expect(service['getStoredAchievementIds']()).toEqual(['A']);
    });
  });
});
