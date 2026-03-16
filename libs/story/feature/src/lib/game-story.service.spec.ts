import { TestBed } from '@angular/core/testing';
import { GameStoryService } from './game-story.service';
import { GAME_STORE } from '@hunt-the-bishomalo/story/api';
import { TranslocoService } from '@jsverse/transloco';
import { Chars } from '@hunt-the-bishomalo/data';
import { signal } from '@angular/core';

describe('GameStoryService', () => {
  let service: GameStoryService;
  let gameStoreMock: any;
  let translocoMock: any;

  beforeEach(() => {
    gameStoreMock = {
      settings: signal({ size: 4, selectedChar: Chars.DEFAULT }),
      lives: signal(3),
      hunter: signal({ arrows: 1, gold: 0 }),
      updateHunter: jest.fn(),
      updateGame: jest.fn(),
    };

    translocoMock = {
      translate: jest.fn(key => `translated_${key}`),
    };

    TestBed.configureTestingModule({
      providers: [
        GameStoryService,
        { provide: GAME_STORE, useValue: gameStoreMock },
        { provide: TranslocoService, useValue: translocoMock },
      ],
    });

    service = TestBed.inject(GameStoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a story for level 1 (size 4)', () => {
    const story = service.getStory();
    expect(story).toBeDefined();
    expect(story?.level).toBe(1);
  });

  it('should return journal entries', () => {
    const entries = service.getJournalEntries();
    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0].level).toBe(1);
  });

  it('should handle level triggers (extraLife)', () => {
    service.checkLevelTrigger({ effect: 'extraLife' } as any);
    expect(gameStoreMock.updateGame).toHaveBeenCalledWith({ lives: 4 });
  });

  it('should handle level triggers (extraArrow)', () => {
    service.checkLevelTrigger({ effect: 'extraArrow' } as any);
    expect(gameStoreMock.updateHunter).toHaveBeenCalledWith({ arrows: 2 });
  });

  it('should handle level triggers (doubleGold)', () => {
    service.checkLevelTrigger({ effect: 'doubleGold' } as any);
    expect(gameStoreMock.updateHunter).toHaveBeenCalledWith({ gold: 200 });
  });

  it('should handle unknown level triggers', () => {
    service.checkLevelTrigger({ effect: 'none' } as any);
    expect(gameStoreMock.updateHunter).not.toHaveBeenCalled();
    expect(gameStoreMock.updateGame).not.toHaveBeenCalled();
  });
});
