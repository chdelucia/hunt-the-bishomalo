import { TestBed } from '@angular/core/testing';
import { AchievementService } from './achievement.service';
import { ACHIEVEMENTS_LIST_TOKEN } from '../api/achievement-service.interface';
import {
  GAME_SOUND_TOKEN,
  ANALYTICS_SERVICE_TOKEN,
} from '../api/tokens';
import { AchieveTypes } from '../models/achievements.model';

describe('AchievementService', () => {
  let service: AchievementService;
  let soundMock: any;
  let analyticsMock: any;

  beforeEach(() => {
    soundMock = {
      playSound: jest.fn(),
      stop: jest.fn(),
    };

    analyticsMock = {
      trackAchievementUnlocked: jest.fn(),
    };

    // Clear localStorage before each test
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AchievementService,
        { provide: ACHIEVEMENTS_LIST_TOKEN, useValue: [] },
        { provide: GAME_SOUND_TOKEN, useValue: soundMock },
        { provide: ANALYTICS_SERVICE_TOKEN, useValue: analyticsMock },
      ],
    });

    service = TestBed.inject(AchievementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should unlock achievement when activeAchievement is called', () => {
    service.achievements.push({ id: AchieveTypes.GAMER, unlocked: false, title: 'Gamer' } as any);
    service.activeAchievement(AchieveTypes.GAMER);
    const gamer = service.achievements.find(a => a.id === AchieveTypes.GAMER);
    expect(gamer?.unlocked).toBe(true);
  });

  it('should check if all completed', () => {
    service.achievements.push({ id: AchieveTypes.FINAL, unlocked: false, title: 'Final' } as any);
    service.achievements.forEach(a => a.unlocked = true);
    service.isAllCompleted();
    expect(service.achievements.find(a => a.id === AchieveTypes.FINAL)?.unlocked).toBe(true);
  });
});
