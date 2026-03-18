import { TestBed } from '@angular/core/testing';
import { AchievementService } from './achievement.service';
import {
  LocalstorageService,
  AnalyticsService,
} from '@hunt-the-bishomalo/core/services';
import { ACHIEVEMENTS_LIST_TOKEN } from '@hunt-the-bishomalo/achievements/api';
import { AchieveTypes } from '@hunt-the-bishomalo/data';

describe('AchievementService', () => {
  let service: AchievementService;
  let localStorageMock: any;
  let analyticsMock: any;

  const mockAchievements = [
    {
      id: AchieveTypes.GAMER,
      title: 'Gamer',
      description: 'Gamer',
      unlocked: false,
      rarity: 'common',
      svgIcon: '',
    },
  ];

  beforeEach(() => {
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
        { provide: ACHIEVEMENTS_LIST_TOKEN, useValue: mockAchievements },
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
    service.activeAchievement(AchieveTypes.GAMER);
    const gamer = service.achievements.find((a) => a.id === AchieveTypes.GAMER);
    expect(gamer?.unlocked).toBe(true);
    expect(analyticsMock.trackAchievementUnlocked).toHaveBeenCalledWith(
      AchieveTypes.GAMER,
      'Gamer'
    );
  });

  it('should sync achievements with storage on initialization', () => {
    localStorageMock.getValue.mockReturnValue([AchieveTypes.GAMER]);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AchievementService,
        { provide: ACHIEVEMENTS_LIST_TOKEN, useValue: mockAchievements },
        { provide: LocalstorageService, useValue: localStorageMock },
        { provide: AnalyticsService, useValue: analyticsMock },
      ],
    });
    service = TestBed.inject(AchievementService);
    const gamer = service.achievements.find((a) => a.id === AchieveTypes.GAMER);
    expect(gamer?.unlocked).toBe(true);
  });
});
