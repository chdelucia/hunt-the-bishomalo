import { TestBed } from '@angular/core/testing';
import { GameEventService } from './game-event.service';
import { GAME_SOUND_TOKEN, GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { Cell, GameSound, AchieveTypes } from '@hunt-the-bishomalo/shared-data';
import { signal } from '@angular/core';

describe('GameEventService', () => {
  let service: GameEventService;
  let gameStoreMock: any;
  let gameSoundMock: any;
  let achievementMock: any;

  beforeEach(() => {
    gameSoundMock = {
      playSound: jest.fn(),
    };

    achievementMock = {
      activeAchievement: jest.fn(),
    };

    gameStoreMock = {
      inventory: signal([]),
      hunter: signal({ arrows: 1, gold: 0 }),
      lives: signal(3),
      dragonballs: signal(0),
      gold: signal(0),
      settings: signal({
        difficulty: {
          maxLives: 8,
          gold: 100,
        }
      }),
      setMessage: jest.fn(),
      updateGame: jest.fn(),
      updateHunter: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        GameEventService,
        { provide: GAME_SOUND_TOKEN, useValue: gameSoundMock },
        { provide: GAME_STORE_TOKEN, useValue: gameStoreMock },
        { provide: ACHIEVEMENT_SERVICE, useValue: achievementMock },
      ],
    });

    service = TestBed.inject(GameEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('applyEffectsOnDeath', () => {
    it('should use rewind item if available', () => {
      gameStoreMock.inventory.set([{ effect: 'rewind' }]);
      const cell: Cell = { x: 1, y: 1, visited: true };
      const prev = { x: 0, y: 0 };

      const result = service.applyEffectsOnDeath('pit', cell, prev);

      expect(result).toBe(true);
      expect(gameSoundMock.playSound).toHaveBeenCalledWith(GameSound.REWIND, false);
      expect(gameStoreMock.updateHunter).toHaveBeenCalledWith(expect.objectContaining({
        x: 0,
        y: 0,
        inventory: []
      }));
    });

    it('should use shield item if available and not rewind', () => {
      gameStoreMock.inventory.set([{ effect: 'shield' }]);
      const cell: Cell = { x: 1, y: 1, visited: true };
      const prev = { x: 0, y: 0 };

      const result = service.applyEffectsOnDeath('wumpus', cell, prev);

      expect(result).toBe(true);
      expect(gameSoundMock.playSound).toHaveBeenCalledWith(GameSound.SHIELD, false);
      expect(gameStoreMock.updateHunter).toHaveBeenCalledWith(expect.objectContaining({
        x: 0,
        y: 0,
        inventory: []
      }));
    });

    it('should handle pit death', () => {
      gameStoreMock.inventory.set([{ effect: 'extra-die' }]);
      const cell: Cell = { x: 1, y: 1, visited: true };
      const prev = { x: 0, y: 0 };

      const result = service.applyEffectsOnDeath('pit', cell, prev);

      expect(result).toBe(true);
      expect(gameSoundMock.playSound).toHaveBeenCalledWith(GameSound.PITDIE, false);
      expect(achievementMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.DEATHBYPIT);
    });

    it('should handle wumpus death', () => {
      gameStoreMock.inventory.set([{ effect: 'extra-wumpus' }]);
      const cell: Cell = { x: 1, y: 1, visited: true };
      const prev = { x: 0, y: 0 };

      const result = service.applyEffectsOnDeath('wumpus', cell, prev);

      expect(result).toBe(true);
      expect(gameSoundMock.playSound).toHaveBeenCalledWith(GameSound.SCREAM, false);
      expect(achievementMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.DEATHBYWUMPUES);
      expect(gameStoreMock.updateGame).toHaveBeenCalledWith({ lives: 2, deathByWumpus: true });
    });

    it('should kill player if no effects can be applied', () => {
      gameStoreMock.inventory.set([]);
      const cell: Cell = { x: 1, y: 1, visited: true };
      const prev = { x: 0, y: 0 };

      const result = service.applyEffectsOnDeath('wumpus', cell, prev);

      expect(result).toBe(false);
      expect(gameStoreMock.updateGame).toHaveBeenCalledWith({ isAlive: false });
    });
  });

  describe('applyEffectByCellContent', () => {
    it('should handle gold pickup', () => {
      gameStoreMock.inventory.set([{ effect: 'extra-goldem' }]);
      const cell: Cell = {
        x: 1,
        y: 1,
        visited: true,
        content: { type: 'gold' } as any,
      };
      service.applyEffectByCellContent(cell);

      expect(gameSoundMock.playSound).toHaveBeenCalledWith(GameSound.PICKUP, false);
      expect(cell.content).toBeUndefined();
    });

    it('should handle dragonball pickup', () => {
      gameStoreMock.inventory.set([{ effect: 'dragonballs' }]);
      const cell: Cell = {
        x: 1,
        y: 1,
        visited: true,
        content: { type: 'dragonball' } as any,
      };
      service.applyEffectByCellContent(cell);

      expect(gameStoreMock.updateHunter).toHaveBeenCalledWith({ dragonballs: 1 });
      expect(gameSoundMock.playSound).toHaveBeenCalledWith(GameSound.SUCCESS, false);
      expect(cell.content).toBeUndefined();
    });

    it('should handle arrow pickup', () => {
      gameStoreMock.inventory.set([{ effect: 'flecha-extra' }]);
      const cell: Cell = {
        x: 1,
        y: 1,
        visited: true,
        content: { type: 'arrow' } as any,
      };
      service.applyEffectByCellContent(cell);

      expect(gameSoundMock.playSound).toHaveBeenCalledWith(GameSound.PICKUP, false);
      expect(achievementMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.PICKARROW);
      expect(gameStoreMock.updateHunter).toHaveBeenCalledWith({ arrows: 2 });
      expect(cell.content).toBeUndefined();
    });

    it('should handle heart pickup', () => {
      gameStoreMock.inventory.set([{ effect: 'extra-heart' }]);
      const cell: Cell = {
        x: 1,
        y: 1,
        visited: true,
        content: { type: 'heart' } as any,
      };
      service.applyEffectByCellContent(cell);

      expect(gameSoundMock.playSound).toHaveBeenCalledWith(GameSound.PICKUP, false);
      expect(achievementMock.activeAchievement).toHaveBeenCalledWith(AchieveTypes.PICKHEART);
      expect(gameStoreMock.updateGame).toHaveBeenCalledWith({ lives: 4 });
      expect(cell.content).toBeUndefined();
    });

    it('should respect max lives', () => {
      gameStoreMock.lives.set(8);
      const cell: Cell = {
        x: 1,
        y: 1,
        visited: true,
        content: { type: 'heart' } as any,
      };
      service.applyEffectByCellContent(cell);

      expect(gameStoreMock.updateGame).toHaveBeenCalledWith({ lives: 8 });
    });

    it('should not pickup second dragonball if already have one', () => {
      gameStoreMock.dragonballs.set(1);
      const cell: Cell = {
        x: 1,
        y: 1,
        visited: true,
        content: { type: 'dragonball' } as any,
      };
      service.applyEffectByCellContent(cell);

      expect(gameStoreMock.updateHunter).not.toHaveBeenCalled();
      expect(cell.content).toBeDefined();
    });

    it('should do nothing if cell has no matching effect', () => {
      const cell: Cell = {
        x: 1,
        y: 1,
        visited: true,
        content: { type: 'unknown' } as any,
      };
      service.applyEffectByCellContent(cell);

      expect(gameStoreMock.setMessage).not.toHaveBeenCalled();
    });
  });
});
