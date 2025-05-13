import { TestBed } from '@angular/core/testing';

import { LeaderboardService } from './leaderboard.service';

describe('LeaderboardService', () => {
  let service: LeaderboardService;
  const mockStorage: Record<string, string> = {};

  beforeEach(() => {
    
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaderboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should clear leaderboard', () => {
    const entry = { player: 'Mario', timeInSeconds: 60 };
    service.addEntry(entry as any);
    expect(service.leaderboard().length).toBe(1);

    service.clear();

    expect(service.leaderboard()).toEqual([]);
  });

});
