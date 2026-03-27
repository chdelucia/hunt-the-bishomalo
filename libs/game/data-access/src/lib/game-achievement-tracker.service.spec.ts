import { TestBed } from '@angular/core/testing';
import { GameAchievementTrackerService } from './game-achievement-tracker.service';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { GAME_STORE_TOKEN, GAME_SOUND_TOKEN } from '@hunt-the-bishomalo/core/api';
import { signal } from '@angular/core';
import { AchieveTypes } from '@hunt-the-bishomalo/shared-data';

describe('GameAchievementTrackerService', () => {
  let service: GameAchievementTrackerService;
  let achieveMock: any;
  let storeMock: any;
  let soundMock: any;

  beforeEach(() => {
    achieveMock = {
      activeAchievement: jest.fn(),
      isAllCompleted: jest.fn(),
    };
    storeMock = {
      settings: signal({ size: 4, difficulty: { luck: 5 }, pits: 2 }),
      hunter: signal({ x: 0, y: 0, arrows: 1 }),
      wumpusKilled: signal(0),
      board: signal([]),
    };
    soundMock = {
      playSound: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        GameAchievementTrackerService,
        { provide: ACHIEVEMENT_SERVICE, useValue: achieveMock },
        { provide: GAME_STORE_TOKEN, useValue: storeMock },
        { provide: GAME_SOUND_TOKEN, useValue: soundMock },
      ],
    });
    service = TestBed.inject(GameAchievementTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle sniper achievement', () => {
    service.handleWumpusKillAchieve({ x: 0, y: 5 } as any);
    expect(achieveMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.SNIPER);
  });

  it('should handle speedrunner achievement', () => {
    storeMock.wumpusKilled.set(1);
    service.calcVictoryAchieve(5);
    expect(achieveMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.SPEEDRUNNER);
  });

  it('should handle cartography achievements', () => {
      storeMock.settings.set({ size: 4, pits: 0 });
      storeMock.board.set([
        [{ visited: true }, { visited: true }, { visited: true }, { visited: true }],
        [{ visited: true }, { visited: true }, { visited: true }, { visited: true }],
        [{ visited: true }, { visited: true }, { visited: true }, { visited: true }],
        [{ visited: true }, { visited: true }, { visited: true }, { visited: true }],
      ]);

      (service as any).cartographyAchieve();
      expect(achieveMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.EXPERTCARTO);
    });

    it('should handle calcDistance with non-aligned coordinates', () => {
      const distance = (service as any).calcDistance({ x: 1, y: 1 });
      expect(distance).toBe(0);
    });

    it('should handle distance for vertical alignment', () => {
      storeMock.hunter.set({ x: 0, y: 0 });
      const distance = (service as any).calcDistance({ x: 2, y: 0 });
      expect(distance).toBe(2);
    });
});
