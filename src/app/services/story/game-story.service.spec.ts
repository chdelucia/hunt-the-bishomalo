import { TestBed } from '@angular/core/testing';

import { GameStoryService } from './game-story.service';

describe('GameStoryService', () => {
  let service: GameStoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameStoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
