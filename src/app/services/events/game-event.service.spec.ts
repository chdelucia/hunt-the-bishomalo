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
    wumpusKilled: false,
    inventory: [],
    lives: 8,
  };

  it('should revive hunter with revive item', () => {
    const hunter: Hunter = {
      ...baseHunter,
      inventory: [{ name: 'vida-extra', image: '', effect: 'revive' }],
    };

    const result = service.applyEffectsOnDeath(hunter, 'pit', {} as Cell);
    expect(result.hunter.alive).toBe(true);
    expect(result.hunter.inventory).toHaveLength(0);
    expect(result.message).toBe('¡Usaste una vida extra y volviste a la vida!');
  });

  it('should shield hunter if killed by wumpus and has shield', () => {
    const hunter: Hunter = {
      ...baseHunter,
      inventory: [{ name: 'escudo', image: '', effect: 'shield' }],
    };

    const result = service.applyEffectsOnDeath(hunter, 'wumpus', {} as Cell);
    expect(result.hunter.alive).toBe(true);
    expect(result.hunter.inventory).toHaveLength(0);
    expect(result.message).toBe('¡Tu escudo bloqueó al Wumpus!');
  });

  it('should apply extra arrow and update hunter', () => {
    const hunter: Hunter = {
      ...baseHunter,
      alive: true,
      inventory: [{ name: 'flecha-extra', image: '', effect: 'arrow' }],
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
      inventory: [{ name: 'extra-heart', image: '', effect: 'heart' }],
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

  it('should apply double gold and remove item', () => {
    const hunter: Hunter = {
      ...baseHunter,
      hasGold: true,
      alive: true,
      inventory: [{ name: 'oro-doble', image: '', effect: 'double-gold' }],
    };

    const result = service.applyEffectByItemName(hunter, 'oro-doble', { x: 0, y: 0 });
    expect(result.hunter.inventory).toHaveLength(0);
    expect(result.message).toBe('¡Tu oro se duplicó!');
  });

  it('should return original hunter if no item is applicable', () => {
    const hunter: Hunter = {
      ...baseHunter,
      alive: false,
      inventory: [],
    };

    const result = service.applyEffectsOnDeath(hunter, 'wumpus', {} as Cell);
    expect(result.hunter.alive).toBe(false);
    expect(result.message).toBeUndefined();
  });
});
