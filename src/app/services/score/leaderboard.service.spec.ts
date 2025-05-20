import { TestBed } from '@angular/core/testing';
import { LeaderboardService } from './leaderboard.service';
import { LocalstorageService } from '../localstorage/localstorage.service';
import { ScoreEntry } from 'src/app/models';

const LocalstorageServiceMock = {
  getValue: jest.fn(),
  setValue: jest.fn(),
  clearValue: jest.fn(),
};

describe('LeaderboardService', () => {
  let service: LeaderboardService;

  beforeEach(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        LeaderboardService,
        { provide: LocalstorageService, useValue: LocalstorageServiceMock },
      ],
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

    expect(service._leaderboard).toEqual([entry]);
    expect(LocalstorageServiceMock.clearValue).toHaveBeenCalledWith(
      'hunt_the_bishomalo_leaderboard',
    );
  });
});
