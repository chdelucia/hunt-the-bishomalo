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
    expect(service.leaderboard()).toEqual([]);
  });

  it('should add an entry and sort leaderboard', () => {
    const entry1: ScoreEntry = { playerName: 'Mario', timeInSeconds: 60, date: new Date() };
    const entry2: ScoreEntry = { playerName: 'Luigi', timeInSeconds: 45, date: new Date() };

    service.addEntry(entry1);
    service.addEntry(entry2);

    expect(service.leaderboard()).toEqual([entry2, entry1]);
    expect(LocalstorageServiceMock.setValue).toHaveBeenCalledTimes(2);
  });

  it('should clear the leaderboard and remove data from storage', () => {
    const entry: ScoreEntry = { playerName: 'Peach', timeInSeconds: 30, date: new Date() };
    service.addEntry(entry);
    expect(service.leaderboard().length).toBe(1);

    service.clear();

    expect(service.leaderboard()).toEqual([]);
    expect(LocalstorageServiceMock.clearValue).toHaveBeenCalledWith('hunt_the_bishomalo_leaderboard');
  });
});
