import { TestBed } from '@angular/core/testing';
import { AchievementService } from './achievement.service';
import { ACHIEVEMENTS_LIST_TOKEN } from '@hunt-the-bishomalo/achievements/api';
import {
  GAME_SOUND_TOKEN,
  LOCALSTORAGE_SERVICE_TOKEN,
  ANALYTICS_SERVICE_TOKEN,
} from '@hunt-the-bishomalo/core/api';
import { AchieveTypes, GameSound } from '@hunt-the-bishomalo/shared-data';

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
        {
          provide: ACHIEVEMENTS_LIST_TOKEN,
          useValue: [{ id: AchieveTypes.GAMER, title: 'Gamer' }],
        },
        { provide: GAME_SOUND_TOKEN, useValue: soundMock },
        { provide: LOCALSTORAGE_SERVICE_TOKEN, useValue: localStorageMock },
        { provide: ANALYTICS_SERVICE_TOKEN, useValue: analyticsMock },
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
  });

  it('should check if all completed', () => {
    service.achievements.push({ id: AchieveTypes.FINAL, unlocked: false } as any);
    service.achievements.forEach((a) => (a.unlocked = true));
    service.isAllCompleted();
    expect(service.achievements.find((a) => a.id === AchieveTypes.FINAL)?.unlocked).toBe(true);
    expect(soundMock.stop).toHaveBeenCalled();
    expect(soundMock.playSound).toHaveBeenCalledWith(GameSound.FF7, false);
  });

  it('should sync achievements with storage', () => {
    localStorageMock.getValue.mockReturnValue([AchieveTypes.GAMER]);
    (service as any).syncAchievementsWithStorage();
    const gamer = service.achievements.find((a) => a.id === AchieveTypes.GAMER);
    expect(gamer?.unlocked).toBe(true);
  });

  it('should handle achievement-unlocked window event', () => {
    const activeSpy = jest.spyOn(service, 'activeAchievement');
    const event = new CustomEvent('achievement-unlocked', { detail: { id: AchieveTypes.GAMER } });
    window.dispatchEvent(event);
    expect(activeSpy).toHaveBeenCalledWith(AchieveTypes.GAMER);
  });

  it('should update local storage when an achievement is unlocked', () => {
    service.achievements.push({ id: 'test-id', unlocked: false, title: 'Test' } as any);
    localStorageMock.getValue.mockReturnValue(['old-id']);
    service.activeAchievement('test-id');
    expect(localStorageMock.setValue).toHaveBeenCalledWith(expect.any(String), ['old-id', 'test-id']);
  });
});
