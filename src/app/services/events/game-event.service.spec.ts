import { TestBed } from '@angular/core/testing';
import { GameEventService } from './game-event.service';
import { GameSoundService } from '../sound/game-sound.service';
import { GameStoreService } from '../store/game-store.service';
import { AchievementService } from '../achievement/achievement.service';
import { Cell, Hunter } from '../../models';

describe('GameEventService', () => {
  let service: GameEventService;

  const mockPlaySound = jest.fn();
  const mockSetMessage = jest.fn();
  const mockUpdateHunter = jest.fn();
  const mockActiveAchievement = jest.fn();
  const mockSettings = jest.fn().mockReturnValue({
    difficulty: {
      maxLevels: 10,
      maxChance: 0.35,
      baseChance: 0.12,
      gold: 60,
      maxLives: 8,
      luck: 8,
    },
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GameEventService,
        {
          provide: GameSoundService,
          useValue: {
            playSound: mockPlaySound,
          },
        },
        {
          provide: GameStoreService,
          useValue: {
            updateHunter: mockUpdateHunter,
            setMessage: mockSetMessage,
            settings: mockSettings,
          },
        },
        {
          provide: AchievementService,
          useValue: {
            activeAchievement: mockActiveAchievement,
          },
        },
      ],
    });

    service = TestBed.inject(GameEventService);

    jest.clearAllMocks();
  });

  const baseHunter: Hunter = {
    x: 0,
    y: 0,
    direction: 0,
    alive: false,
    arrows: 1,
    hasGold: false,
    hasWon: false,
    wumpusKilled: 0,
    inventory: [],
    lives: 8,
    gold: 0,
  };

  it('should revive hunter with revive item', () => {
    const hunter: Hunter = {
      ...baseHunter,
      inventory: [{ name: 'vida-extra', icon: '', effect: 'rewind' }],
    };

    const result = service.applyEffectsOnDeath(hunter, 'pit', {} as Cell, { x: 1, y: 0 });
    expect(result.hunter.alive).toBe(true);
    expect(result.message).toContain('¡Rebobinaste');
  });

  it('should shield hunter if killed by wumpus and has shield', () => {
    const hunter: Hunter = {
      ...baseHunter,
      inventory: [{ name: 'escudo', icon: '', effect: 'shield' }],
    };

    const result = service.applyEffectsOnDeath(hunter, 'wumpus', {} as Cell, { x: 1, y: 0 });
    expect(result.hunter.alive).toBe(true);
    expect(result.message).toContain('¡Tu escudo bloqueó al Wumpus!');
  });

  it('should apply extra arrow and update hunter', () => {
    const hunter: Hunter = {
      ...baseHunter,
      alive: true,
      inventory: [{ name: 'flecha-extra', icon: '', effect: 'arrow' }],
    };

    service.applyEffectByCellContent(hunter, {
      x: 0,
      y: 0,
      content: { type: 'arrow', image: '', alt: '', ariaLabel: '' },
    });

    expect(mockPlaySound).toHaveBeenCalled();
    expect(mockActiveAchievement).toHaveBeenCalled();
    expect(mockUpdateHunter).toHaveBeenCalledWith(
      expect.objectContaining({ arrows: hunter.arrows + 1 }),
    );
    expect(mockSetMessage).toHaveBeenCalledWith('Has recogido una flecha.');
  });

  it('should apply extra heart and increase lives', () => {
    const hunter: Hunter = {
      ...baseHunter,
      alive: true,
      lives: 1,
      inventory: [{ name: 'extra-heart', icon: '', effect: 'heart' }],
    };

    service.applyEffectByCellContent(hunter, {
      x: 0,
      y: 0,
      content: { type: 'heart', image: '', alt: '', ariaLabel: '' },
    });

    expect(mockPlaySound).toHaveBeenCalled();
    expect(mockUpdateHunter).toHaveBeenCalledWith(expect.objectContaining({ lives: 2 }));
    expect(mockSetMessage).toHaveBeenCalledWith('Has conseguido una vida extra.');
  });

  it('should return original hunter if no item is applicable', () => {
    const hunter: Hunter = {
      ...baseHunter,
      alive: false,
      inventory: [],
    };

    const result = service.applyEffectsOnDeath(hunter, 'wumpus', {} as Cell, { x: 1, y: 0 });
    expect(result.hunter.alive).toBe(false);
    expect(result.message).toBeUndefined();
  });
});
