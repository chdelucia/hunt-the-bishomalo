import { TestBed } from '@angular/core/testing';
import { LeaderboardService } from './leaderboard.service';
import { LocalstorageService } from '@hunt-the-bishomalo/core/services';

describe('LeaderboardService', () => {
  let service: LeaderboardService;
  let mockLocalStorageService: any;

  beforeEach(() => {
    mockLocalStorageService = {
      getValue: jest.fn().mockReturnValue([]),
      setValue: jest.fn(),
      clearValue: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        LeaderboardService,
        { provide: LocalstorageService, useValue: mockLocalStorageService },
      ],
    });

    service = TestBed.inject(LeaderboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load leaderboard from storage on init', () => {
    expect(mockLocalStorageService.getValue).toHaveBeenCalledWith('hunt_the_bishomalo_leaderboard');
  });

  it('should add entry', () => {
    const entry = { playerName: 'Test', level: 1 } as any;
    service.addEntry(entry);
    expect(service.leaderboard.length).toBe(1);
    expect(mockLocalStorageService.setValue).toHaveBeenCalled();
  });

  it('should clear leaderboard', () => {
    service.clear();
    expect(mockLocalStorageService.clearValue).toHaveBeenCalledWith('hunt_the_bishomalo_leaderboard');
    expect(service.leaderboard).toEqual([]);
  });
});
