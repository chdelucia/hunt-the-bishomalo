import { TestBed } from '@angular/core/testing';
import { AchievementService } from './achievement.service';
import { ACHIEVEMENTS_LIST_TOKEN } from '@hunt-the-bishomalo/achievements/api';
import { GameSoundService, LocalstorageService, AnalyticsService } from '@hunt-the-bishomalo/core/services';
import { signal } from '@angular/core';
import { GameSound, AchieveTypes } from '@hunt-the-bishomalo/data';

describe('AchievementService', () => {
  let service: AchievementService;
  let soundMock: any;
  let localStorageMock: any;
  let analyticsMock: any;

  beforeEach(() => {
    soundMock = {
      playSound: jest.fn(),
      stop: jest.fn(),
    };

    localStorageMock = {
      getValue: jest.fn(() => []),
      setValue: jest.fn(),
    };

    analyticsMock = {
      trackAchievementUnlocked: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AchievementService,
        { provide: ACHIEVEMENTS_LIST_TOKEN, useValue: [] },
        { provide: GameSoundService, useValue: soundMock },
        { provide: LocalstorageService, useValue: localStorageMock },
        { provide: AnalyticsService, useValue: analyticsMock },
      ],
    });

    service = TestBed.inject(AchievementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should unlock achievement when activeAchievement is called', () => {
    service.achievements.push({ id: AchieveTypes.GAMER, unlocked: false } as any);
    service.activeAchievement(AchieveTypes.GAMER);
    const gamer = service.achievements.find(a => a.id === AchieveTypes.GAMER);
    expect(gamer?.unlocked).toBe(true);
  });

  it('should check if all completed', () => {
    service.achievements.push({ id: AchieveTypes.FINAL, unlocked: false } as any);
    service.achievements.forEach(a => a.unlocked = true);
    service.isAllCompleted();
    expect(service.achievements.find(a => a.id === AchieveTypes.FINAL)?.unlocked).toBe(true);
  });
});
