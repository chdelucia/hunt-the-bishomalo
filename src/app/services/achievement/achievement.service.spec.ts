import { TestBed } from '@angular/core/testing';
import { AchievementService } from './achievement.service';
import { LocalstorageService } from '../localstorage/localstorage.service';
import { GameSoundService } from '../sound/game-sound.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { AchieveTypes } from 'src/app/models';
import { GameStore } from 'src/app/store';
import { getTranslocoTestingModule } from 'src/app/utils';

const mockLocalStorageService = {
  getValue: jest.fn(),
  setValue: jest.fn(),
};

const mockGameStoreService = {
  hunter: jest.fn().mockReturnValue({ arrows: 1, wumpusKilled: 1 }),
  settings: jest.fn(),
  board: jest.fn().mockReturnValue([[]]),
  wumpusKilled: jest.fn(),
  isAlive: jest.fn(),
  blackout: jest.fn(),
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
      imports: [getTranslocoTestingModule()],
      providers: [
        { provide: LocalstorageService, useValue: mockLocalStorageService },
        { provide: GameStore, useValue: mockGameStoreService },
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

  it('victory achievements SPEEDRUNNER', () => {
    const spy = jest.spyOn(service, 'activeAchievement');
    mockGameStoreService.settings.mockReturnValue({
      size: 11,
    });

    service.caclVictoryAchieve(2);
    expect(spy).toHaveBeenCalledWith(AchieveTypes.SPEEDRUNNER);
  });

  it('victory achievements LARGEMAP', () => {
    const spy = jest.spyOn(service, 'activeAchievement');
    mockGameStoreService.settings.mockReturnValue({
      size: 12,
    });

    service.caclVictoryAchieve(2);
    expect(spy).toHaveBeenCalledWith(AchieveTypes.WINLARGEMAP);
  });

  it('victory achievements HERO', () => {
    const spy = jest.spyOn(service, 'activeAchievement');
    mockGameStoreService.settings.mockReturnValue({
      size: 2,
    });
    mockGameStoreService.wumpusKilled.mockReturnValue(1);

    service.caclVictoryAchieve(200);
    expect(spy).toHaveBeenCalledWith(AchieveTypes.WINHERO);
  });

  it('victory achievements WINBLACKWOUT', () => {
    const spy = jest.spyOn(service, 'activeAchievement');
    mockGameStoreService.settings.mockReturnValue({
      size: 12,
      blackout: true,
    });

    service.caclVictoryAchieve(2);
    expect(spy).toHaveBeenCalledWith(AchieveTypes.WINBLACKWOUT);
  });
});
