import { TestBed } from '@angular/core/testing';
import { GameSideEffectService } from './game-side-effect.service';
import { GAME_STORE_TOKEN, GAME_SOUND_TOKEN } from '@hunt-the-bishomalo/core/api';
import {
  GAME_ACHIEVEMENT_TRACKER_TOKEN,
  GAME_STATS_TRACKER_TOKEN,
} from '@hunt-the-bishomalo/game/api';
import { signal } from '@angular/core';

describe('GameSideEffectService', () => {
  let service: GameSideEffectService;
  let storeMock: any;
  let soundMock: any;
  let achievementTrackerMock: any;
  let statsTrackerMock: any;

  beforeEach(() => {
    storeMock = {
      isAlive: signal(true),
      hasWon: signal(false),
      settings: signal({ blackout: false }),
      wumpusKilled: signal(0),
      blackout: signal(false),
    };

    soundMock = {
      playSound: jest.fn(),
    };

    achievementTrackerMock = {
      activeAchievement: jest.fn(),
    };

    statsTrackerMock = {
      trackSteps: jest.fn(),
      handleGameOver: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        GameSideEffectService,
        { provide: GAME_STORE_TOKEN, useValue: storeMock },
        { provide: GAME_SOUND_TOKEN, useValue: soundMock },
        { provide: GAME_ACHIEVEMENT_TRACKER_TOKEN, useValue: achievementTrackerMock },
        { provide: GAME_STATS_TRACKER_TOKEN, useValue: statsTrackerMock },
      ],
    });
    service = TestBed.inject(GameSideEffectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
