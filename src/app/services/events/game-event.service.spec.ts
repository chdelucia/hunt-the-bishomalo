import { TestBed } from '@angular/core/testing';
import { GameEventService } from './game-event.service';
import { GameSoundService } from '../sound/game-sound.service';
import { AchievementService } from '../achievement/achievement.service';
import { Cell, Hunter } from '../../models';
import { GameStore } from 'src/app/store';

describe('GameEventService', () => {
  let service: GameEventService;

  const mockPlaySound = jest.fn();
  const mockSetMessage = jest.fn();
  const mockUpdateHunter = jest.fn();
  const mockActiveAchievement = jest.fn();
  const mockHunter = jest.fn();
  const mockInventory = jest.fn();
  const mockUpdateGame = jest.fn();
  const mockSettings = jest.fn().mockReturnValue({
    difficulty: {
      maxLevels: 10,
      maxChance: 0.35,
      baseChance: 0.12,
      gold: 60,
      maxLives: 8,
      luck: 8,
      bossTries: 12,
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
          provide: GameStore,
          useValue: {
            updateHunter: mockUpdateHunter,
            setMessage: mockSetMessage,
            settings: mockSettings,
            hunter: mockHunter,
            inventory: mockInventory,
            lives: () => 2,
            dragonballs: () => 0,
            arrows: () => 1,
            wumpusKilled: () => 1,
            isAlive: () => true,
            hasWon: jest.fn(),
            updateGame: mockUpdateGame,
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
    arrows: 1,
    hasGold: false,
    inventory: [],
    gold: 0,
  };

  it('should revive hunter with revive item', () => {
    mockHunter.mockReturnValue({
      ...baseHunter,
      inventory: [{ name: 'vida-extra', icon: '', effect: 'rewind' }],
    });

    mockInventory.mockReturnValue([{ name: 'vida-extra', icon: '', effect: 'rewind' }]);

    const result = service.applyEffectsOnDeath('pit', {} as Cell, { x: 1, y: 0 });
    expect(result).toBe(true);
    expect(mockSetMessage).toHaveBeenCalledWith(
      '¡Rebobinaste el tiempo y volviste a tu posición anterior!',
    );
  });

  it('should shield hunter if killed by wumpus and has shield', () => {
    mockHunter.mockReturnValue({
      ...baseHunter,
      inventory: [{ name: 'escudo', icon: '', effect: 'shield' }],
    });

    mockInventory.mockReturnValue([{ name: 'escudo', icon: '', effect: 'shield' }]);

    const result = service.applyEffectsOnDeath('wumpus', {} as Cell, { x: 1, y: 0 });
    expect(result).toBe(true);
    expect(mockSetMessage).toHaveBeenCalledWith('¡Tu escudo bloqueó al Wumpus! pero se rompió.');
  });

  it('should apply extra arrow and update hunter', () => {
    mockHunter.mockReturnValue({
      ...baseHunter,
      alive: true,
      inventory: [{ name: 'flecha-extra', icon: '', effect: 'arrow' }],
    });

    service.applyEffectByCellContent({
      x: 0,
      y: 0,
      content: { type: 'arrow', image: '', alt: '', ariaLabel: '' },
    });

    expect(mockPlaySound).toHaveBeenCalled();
    expect(mockActiveAchievement).toHaveBeenCalled();
    expect(mockUpdateHunter).toHaveBeenCalledWith(expect.objectContaining({ arrows: 2 }));
    expect(mockSetMessage).toHaveBeenCalledWith('Has recogido una flecha.');
  });

  it('should apply extra heart and increase lives', () => {
    mockHunter.mockReturnValue({
      ...baseHunter,
      alive: true,
      inventory: [{ name: 'extra-heart', icon: '', effect: 'heart' }],
    });

    service.applyEffectByCellContent({
      x: 0,
      y: 0,
      content: { type: 'heart', image: '', alt: '', ariaLabel: '' },
    });

    expect(mockPlaySound).toHaveBeenCalled();
    expect(mockUpdateGame).toHaveBeenCalledWith(expect.objectContaining({ lives: 3 }));
    expect(mockSetMessage).toHaveBeenCalledWith('Has conseguido una vida extra.');
  });

  it('should apply dragon ball pickup', () => {
    mockHunter.mockReturnValue({
      ...baseHunter,
      alive: true,
      lives: 1,
      inventory: [{ name: 'dragonball', icon: '', effect: 'dragonball' }],
    });

    mockInventory.mockReturnValue([{ name: 'dragonball', icon: '', effect: 'dragonball' }]);

    service.applyEffectByCellContent({
      x: 0,
      y: 0,
      content: { type: 'dragonball', image: '', alt: '', ariaLabel: '' },
    });

    expect(mockPlaySound).toHaveBeenCalled();
    expect(mockUpdateHunter).toHaveBeenCalledWith(expect.objectContaining({ dragonballs: 1 }));
    expect(mockSetMessage).toHaveBeenCalledWith('¡Conseguiste una bola de drac con 4 estrellas!');
  });

  it('should return original hunter if no item is applicable', () => {
    mockHunter.mockReturnValue({
      ...baseHunter,
      alive: false,
      inventory: [],
    });

    mockInventory.mockReturnValue([]);

    const result = service.applyEffectsOnDeath('wumpus', {} as Cell, { x: 1, y: 0 });
    expect(result).toBe(false);
    expect(mockSetMessage).not.toHaveBeenCalled();
  });
});
