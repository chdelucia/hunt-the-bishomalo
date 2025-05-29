import { TestBed } from '@angular/core/testing';
import { LeaderboardService } from './leaderboard.service';
import { LocalstorageService } from '../localstorage/localstorage.service';
import { ScoreEntry } from 'src/app/models';
import { GameStore } from 'src/app/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { getTranslocoTestingModule } from 'src/app/utils';

const LocalstorageServiceMock = {
  getValue: jest.fn(),
  setValue: jest.fn(),
  clearValue: jest.fn(),
};

const mockGameStoreService = {
  hunter: jest.fn().mockReturnValue({ arrows: 3, hasGold: false }),
  wumpusKilled: jest.fn(),
  hunterAlive: jest.fn(),
  blackout: jest.fn(),
  startTime: () => jest.fn(),
  char: jest.fn(),
  settings: jest.fn().mockReturnValue({
    size: 4,
    arrows: 2,
    difficulty: {
      baseChance: 0.12,
      gold: 60,
      luck: 8,
      maxChance: 0.35,
      maxLevels: 10,
      maxLives: 8,
      bossTries: 12,
    },
  }),
  message: jest.fn().mockReturnValue('¡El Wumpus te devoró!'),
  setMessage: jest.fn(),
  board: jest.fn(),
};

describe('LeaderboardService', () => {
  let service: LeaderboardService;

  beforeEach(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule()],
      providers: [
        LeaderboardService,
        { provide: LocalstorageService, useValue: LocalstorageServiceMock },
        { provide: GameStore, useValue: mockGameStoreService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    service = TestBed.inject(LeaderboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty leaderboard if storage is empty', () => {
    expect(service._leaderboard).toEqual([]);
  });

  it('should add an entry and sort leaderboard', () => {
    const entry1 = { playerName: 'Mario', timeInSeconds: 60, date: new Date() };
    const entry2 = { playerName: 'Luigi', timeInSeconds: 45, date: new Date() };

    service['addEntry'](entry1 as ScoreEntry);
    service['addEntry'](entry2 as ScoreEntry);

    expect(service._leaderboard).toEqual([entry1, entry2]);
    expect(LocalstorageServiceMock.setValue).toHaveBeenCalledTimes(2);
  });

  it('should clear the leaderboard and remove data from storage', () => {
    const entry = { playerName: 'Peach', timeInSeconds: 30, date: new Date() };
    service['addEntry'](entry as ScoreEntry);
    expect(service._leaderboard.length).toBe(1);

    service.clear();

    expect(service._leaderboard).toEqual([]);
    expect(LocalstorageServiceMock.clearValue).toHaveBeenCalledWith(
      'hunt_the_bishomalo_leaderboard',
    );
  });
});
