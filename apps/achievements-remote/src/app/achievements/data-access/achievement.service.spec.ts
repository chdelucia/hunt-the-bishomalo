import { TestBed } from '@angular/core/testing';
import { AchievementService } from './achievement.service';
import {
  LOCALSTORAGE_SERVICE_TOKEN,
  ANALYTICS_SERVICE_TOKEN,
} from './core-api.model';
import { AchieveTypes } from './achievement.model';
import { AchievementsFacade } from './achievements.facade';
import { signal, WritableSignal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

describe('AchievementService', () => {
  let service: AchievementService;
  let localStorageMock: any;
  let analyticsMock: any;
  let facadeMock: { config: WritableSignal<any> };
  let httpMock: any;

  beforeEach(() => {
    localStorageMock = {
      getValue: jest.fn(() => []),
      setValue: jest.fn(),
    };

    analyticsMock = {
      trackAchievementUnlocked: jest.fn(),
    };

    facadeMock = {
      config: signal(null),
    };

    httpMock = {
      get: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AchievementService,
        { provide: LOCALSTORAGE_SERVICE_TOKEN, useValue: localStorageMock },
        { provide: ANALYTICS_SERVICE_TOKEN, useValue: analyticsMock },
        { provide: AchievementsFacade, useValue: facadeMock },
        { provide: HttpClient, useValue: httpMock },
      ],
    });

    service = TestBed.inject(AchievementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should unlock achievement when activeAchievement is called', () => {
    service.achievementsSignal.set([
      { id: AchieveTypes.GAMER, title: 'Gamer', unlocked: false } as any,
    ]);
    service.activeAchievement(AchieveTypes.GAMER);
    const gamer = service.achievements().find((a) => a.id === AchieveTypes.GAMER);
    expect(gamer?.unlocked).toBe(true);
  });

  it('should check if all completed', () => {
    service.achievementsSignal.set([
      { id: AchieveTypes.GAMER, unlocked: true } as any,
      { id: AchieveTypes.FINAL, unlocked: false } as any,
    ]);
    service.isAllCompleted();
    expect(service.achievements().find((a) => a.id === AchieveTypes.FINAL)?.unlocked).toBe(true);
  });

  it('should sync achievements with storage', () => {
    service.achievementsSignal.set([
      { id: AchieveTypes.GAMER, unlocked: false } as any,
    ]);
    localStorageMock.getValue.mockReturnValue([AchieveTypes.GAMER]);
    (service as any).syncAchievementsWithStorage();
    const gamer = service.achievements().find((a) => a.id === AchieveTypes.GAMER);
    expect(gamer?.unlocked).toBe(true);
  });

  it('should buffer activeAchievement if list not loaded', () => {
    service.activeAchievement(AchieveTypes.GAMER);
    expect(service.achievements().length).toBe(0);
    expect((service as any).activeBuffer).toContain(AchieveTypes.GAMER);
  });

  it('should process buffer after list is loaded', () => {
    const mockAchieve = { id: AchieveTypes.GAMER, unlocked: false, title: 'G' };
    httpMock.get.mockReturnValue(of([mockAchieve]));

    service.activeAchievement(AchieveTypes.GAMER);
    expect((service as any).activeBuffer).toContain(AchieveTypes.GAMER);

    facadeMock.config.set({ appId: 'test' });
    TestBed.flushEffects();

    expect(service.achievements().length).toBe(1);
    expect(service.achievements()[0].id).toBe(AchieveTypes.GAMER);
    // Note: processBuffer calls activeAchievement which updates the signal
    expect(service.achievements()[0].unlocked).toBe(true);
    expect((service as any).activeBuffer.length).toBe(0);
  });

  it('should handle achievement-unlocked window event', () => {
    const activeSpy = jest.spyOn(service, 'activeAchievement');
    const event = new CustomEvent('achievement-unlocked', { detail: { id: AchieveTypes.GAMER } });
    window.dispatchEvent(event);
    expect(activeSpy).toHaveBeenCalledWith(AchieveTypes.GAMER);
  });

  it('should update local storage when an achievement is unlocked', () => {
    service.achievementsSignal.set([
      { id: 'test-id', unlocked: false, title: 'Test' } as any,
    ]);
    localStorageMock.getValue.mockReturnValue(['old-id']);
    service.activeAchievement('test-id');
    expect(localStorageMock.setValue).toHaveBeenCalledWith(expect.any(String), ['old-id', 'test-id']);
  });
});
