import { TestBed } from '@angular/core/testing';
import { GameStoryService } from './game-story.service';
import { LevelStory } from './stories.const';
import { GameStore } from 'src/app/store';
import { getTranslocoTestingModule } from 'src/app/utils';

const mockSettings = {
  size: 6,
  selectedChar: 'DEFAULT',
};

const mockHunter = {
  arrows: 2,
  lives: 3,
  gold: 100,
};

const mockUpdateHunter = jest.fn();
const mockSettingsFn = jest.fn(() => mockSettings);
const mockHunterFn = jest.fn(() => mockHunter);

const mockGameStoreService = {
  settings: mockSettingsFn,
  hunter: mockHunterFn,
  updateHunter: mockUpdateHunter,
};
describe('GameStoryService', () => {
  let service: GameStoryService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule()],
      providers: [GameStoryService, { provide: GameStore, useValue: mockGameStoreService }],
    });

    service = TestBed.inject(GameStoryService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('checkLevelTrigger', () => {
    it('should handle extraArrow effect', () => {
      const level: LevelStory = { level: 1, title: '', text: '', effect: 'extraArrow' };
      service.checkLevelTrigger(level);
      expect(mockUpdateHunter).toHaveBeenCalledWith({ arrows: 3 }); // 2 + 1
    });

    it('should handle extraLife effect', () => {
      const level: LevelStory = { level: 1, title: '', text: '', effect: 'extraLife' };
      service.checkLevelTrigger(level);
      expect(mockUpdateHunter).toHaveBeenCalledWith({ lives: 4 }); // 3 + 1
    });

    it('should handle doubleGold effect', () => {
      const level: LevelStory = { level: 1, title: '', text: '', effect: 'doubleGold' };
      service.checkLevelTrigger(level);
      expect(mockUpdateHunter).toHaveBeenCalledWith({ gold: 300 }); // 100 + 200
    });

    it('should do nothing for unknown effect', () => {
      const level: LevelStory = { level: 1, title: '', text: '', effect: 'unknownEffect' as any };
      service.checkLevelTrigger(level);
      expect(mockUpdateHunter).not.toHaveBeenCalled();
    });
  });
});
