import { TestBed } from '@angular/core/testing';
import { AchievementService } from './achievement.service';
import { GameStore } from '@hunt-the-bishomalo/core/store';
import { GameSoundService, LocalstorageService, AnalyticsService } from '@hunt-the-bishomalo/core/services';
import { signal } from '@angular/core';
import { GameSound, AchieveTypes } from '@hunt-the-bishomalo/data';

describe('AchievementService', () => {
  let service: AchievementService;
  let storeMock: any;
  let soundMock: any;
  let localStorageMock: any;
  let analyticsMock: any;

  beforeEach(() => {
    storeMock = {
      wumpusKilled: signal(0),
      isAlive: signal(true),
      blackout: signal(false),
      hunter: signal({ arrows: 1, x: 0, y: 0 }),
      settings: signal({ size: 4, difficulty: { luck: 5 } }),
      board: signal([]),
    };

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
        { provide: GameStore, useValue: storeMock },
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
    service.activeAchievement(AchieveTypes.GAMER);
    const gamer = service.achievements.find(a => a.id === AchieveTypes.GAMER);
    expect(gamer?.unlocked).toBe(true);
  });

  it('should handle penta kill', () => {
    storeMock.wumpusKilled.set(5);
    TestBed.flushEffects();
    expect(soundMock.playSound).toHaveBeenCalledWith(GameSound.PENTA, false);
  });

  it('should handle victory achievements', () => {
    service.calcVictoryAchieve(5);
    const ach = service.achievements.find(a => a.id === AchieveTypes.SPEEDRUNNER);
    expect(ach?.unlocked).toBe(true);
  });

  it('should unlock death achievements', () => {
    storeMock.isAlive.set(false);
    TestBed.flushEffects();
    expect(service.achievements.find(a => a.id === AchieveTypes.LASTBREATH)?.unlocked).toBe(true);
  });

  it('should handle wumpus kill achievement (DEATHDUEL)', () => {
    service.handleWumpusKillAchieve({ x: 0, y: 1 } as any);
    expect(service.achievements.find(a => a.id === AchieveTypes.DEATHDUEL)?.unlocked).toBe(true);
  });

  it('should handle wumpus kill achievement (SNIPER)', () => {
    storeMock.hunter.set({ x: 0, y: 0 });
    service.handleWumpusKillAchieve({ x: 0, y: 5 } as any);
    expect(service.achievements.find(a => a.id === AchieveTypes.SNIPER)?.unlocked).toBe(true);
  });

  it('should check if all completed', () => {
    service.achievements.forEach(a => a.unlocked = true);
    service.isAllCompleted();
    expect(service.achievements.find(a => a.id === AchieveTypes.FINAL)?.unlocked).toBe(true);
  });

  it('should handle cartography', () => {
    storeMock.settings.set({ size: 4, pits: 0 });
    storeMock.board.set([
       [{visited: true}, {visited: true}, {visited: true}, {visited: true}],
       [{visited: true}, {visited: true}, {visited: true}, {visited: true}],
       [{visited: true}, {visited: true}, {visited: true}, {visited: true}],
       [{visited: true}, {visited: true}, {visited: true}, {visited: true}],
    ]);
    service.calcVictoryAchieve(100);
    expect(service.achievements.find(a => a.id === AchieveTypes.EXPERTCARTO)?.unlocked).toBe(true);
  });
});
