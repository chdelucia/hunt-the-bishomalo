import { TestBed } from '@angular/core/testing';
import { GameAchievementsService } from './game-achievements.service';
import { GameStore } from '@hunt-the-bishomalo/core/store';
import { GameSoundService } from '@hunt-the-bishomalo/core/services';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { signal } from '@angular/core';
import { AchieveTypes, GameSound } from '@hunt-the-bishomalo/data';

describe('GameAchievementsService', () => {
  let service: GameAchievementsService;
  let gameStoreMock: any;
  let gameSoundMock: any;
  let achievementServiceMock: any;

  beforeEach(() => {
    gameStoreMock = {
      wumpusKilled: signal(0),
      isAlive: signal(true),
      blackout: signal(false),
      hunter: signal({ arrows: 1, x: 0, y: 0 }),
      settings: signal({
        size: 4,
        difficulty: { luck: 5, maxLevels: 10, gold: 50 },
        blackout: false,
        pits: 1,
      }),
      board: signal([]),
    };

    gameSoundMock = {
      playSound: jest.fn(),
      stop: jest.fn(),
    };

    achievementServiceMock = {
      activeAchievement: jest.fn(),
      achievements: [
        { id: '1', unlocked: false },
        { id: '2', unlocked: false },
        { id: '3', unlocked: false },
        { id: '4', unlocked: false },
        { id: '5', unlocked: false },
      ],
    };

    TestBed.configureTestingModule({
      providers: [
        GameAchievementsService,
        { provide: GameStore, useValue: gameStoreMock },
        { provide: GameSoundService, useValue: gameSoundMock },
        { provide: ACHIEVEMENT_SERVICE, useValue: achievementServiceMock },
      ],
    });

    service = TestBed.inject(GameAchievementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle penta kill', () => {
    gameStoreMock.wumpusKilled.set(5);
    TestBed.flushEffects();
    expect(achievementServiceMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.PENTA);
    expect(gameSoundMock.playSound).toHaveBeenCalledWith(GameSound.PENTA, false);
  });

  it('should unlock death achievements (DEATHBYBLACKOUT)', () => {
    gameStoreMock.blackout.set(true);
    gameStoreMock.isAlive.set(false);
    TestBed.flushEffects();
    expect(achievementServiceMock.activeAchievement).toHaveBeenCalledWith(
      AchieveTypes.DEATHBYBLACKOUT
    );
  });

  it('should unlock death achievements (LASTBREATH)', () => {
    gameStoreMock.blackout.set(false);
    gameStoreMock.isAlive.set(false);
    TestBed.flushEffects();
    expect(achievementServiceMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.LASTBREATH);
  });

  describe('calcVictoryAchieve', () => {
    it('should handle blackout victory', () => {
      gameStoreMock.settings.set({ ...gameStoreMock.settings(), blackout: true });
      service.calcVictoryAchieve(20);
      expect(achievementServiceMock.activeAchievement).toHaveBeenCalledWith(
        AchieveTypes.WINBLACKWOUT
      );
    });

    it('should handle wasted arrows', () => {
      gameStoreMock.hunter.set({ arrows: 2, x: 0, y: 0 });
      gameStoreMock.wumpusKilled.set(0);
      service.calcVictoryAchieve(20);
      expect(achievementServiceMock.activeAchievement).toHaveBeenCalledWith(
        AchieveTypes.WASTEDARROWS
      );
    });

    it('should handle speedrunner', () => {
      service.calcVictoryAchieve(5);
      expect(achievementServiceMock.activeAchievement).toHaveBeenCalledWith(
        AchieveTypes.SPEEDRUNNER
      );
    });

    it('should handle rat escape', () => {
      gameStoreMock.wumpusKilled.set(0);
      service.calcVictoryAchieve(20);
      expect(achievementServiceMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.WRAT);
    });

    it('should handle hero victory', () => {
      gameStoreMock.wumpusKilled.set(1);
      service.calcVictoryAchieve(20);
      expect(achievementServiceMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.WINHERO);
    });

    it('should handle large map completion', () => {
      gameStoreMock.settings.set({ ...gameStoreMock.settings(), size: 12 });
      service.calcVictoryAchieve(20);
      expect(achievementServiceMock.activeAchievement).toHaveBeenCalledWith(
        AchieveTypes.WINLARGEMAP
      );
    });
  });

  describe('handleWumpusKillAchieve', () => {
    it('should handle blind wumpus killed', () => {
      gameStoreMock.settings.set({ ...gameStoreMock.settings(), blackout: true });
      service.handleWumpusKillAchieve({ x: 0, y: 1 } as any);
      expect(achievementServiceMock.activeAchievement).toHaveBeenCalledWith(
        AchieveTypes.BLINDWUMPUSKILLED
      );
    });

    it('should handle sniper achievement', () => {
      gameStoreMock.hunter.set({ x: 0, y: 0 });
      service.handleWumpusKillAchieve({ x: 0, y: 4 } as any);
      expect(achievementServiceMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.SNIPER);
    });

    it('should handle death duel achievement', () => {
      gameStoreMock.hunter.set({ x: 0, y: 0 });
      service.handleWumpusKillAchieve({ x: 0, y: 1 } as any);
      expect(achievementServiceMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.DEATHDUEL);
    });

    it('should handle regular wumpus kill', () => {
      gameStoreMock.hunter.set({ x: 0, y: 0 });
      service.handleWumpusKillAchieve({ x: 0, y: 2 } as any);
      expect(achievementServiceMock.activeAchievement).toHaveBeenCalledWith(
        AchieveTypes.WUMPUSKILLED
      );
    });

    it('should return 0 distance if not in same axis', () => {
      gameStoreMock.hunter.set({ x: 0, y: 0 });
      service.handleWumpusKillAchieve({ x: 1, y: 1 } as any);
      expect(achievementServiceMock.activeAchievement).toHaveBeenCalledWith(
        AchieveTypes.WUMPUSKILLED
      );
    });
  });

  describe('cartographyAchieve', () => {
    it('should handle expert cartographer', () => {
      gameStoreMock.settings.set({ size: 2, pits: 0 });
      gameStoreMock.board.set([
        [{ visited: true }, { visited: true }],
        [{ visited: true }, { visited: true }],
      ]);
      service.calcVictoryAchieve(20);
      expect(achievementServiceMock.activeAchievement).toHaveBeenCalledWith(
        AchieveTypes.EXPERTCARTO
      );
    });

    it('should handle novice cartographer', () => {
      gameStoreMock.settings.set({ size: 2, pits: 0 });
      gameStoreMock.board.set([
        [{ visited: true }, { visited: true }],
        [{ visited: true }, { visited: false }],
      ]);
      service.calcVictoryAchieve(20);
      expect(achievementServiceMock.activeAchievement).toHaveBeenCalledWith(
        AchieveTypes.NOVICECARTO
      );
    });
  });

  it('should check if all completed', () => {
    achievementServiceMock.achievements = [
      { id: '1', unlocked: true },
      { id: '2', unlocked: true },
      { id: '3', unlocked: false },
    ];
    service.isAllCompleted();
    expect(achievementServiceMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.FINAL);
    expect(gameSoundMock.stop).toHaveBeenCalled();
    expect(gameSoundMock.playSound).toHaveBeenCalledWith(GameSound.FF7, false);
  });

  it('should proxy activeAchievement', () => {
    service.activeAchievement(AchieveTypes.GAMER);
    expect(achievementServiceMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.GAMER);
  });
});
