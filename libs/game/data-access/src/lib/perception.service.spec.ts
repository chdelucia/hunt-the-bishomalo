import { TestBed } from '@angular/core/testing';
import { PerceptionService } from './perception.service';
import { TranslocoService } from '@jsverse/transloco';
import { GAME_SOUND_TOKEN } from '@hunt-the-bishomalo/core/api';
import { Cell } from '@hunt-the-bishomalo/shared-data';

describe('PerceptionService', () => {
  let service: PerceptionService;
  let translocoMock: any;
  let soundMock: any;

  beforeEach(() => {
    translocoMock = {
      translate: jest.fn((key) => key),
    };

    soundMock = { playSound: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        PerceptionService,
        { provide: TranslocoService, useValue: translocoMock },
        { provide: GAME_SOUND_TOKEN, useValue: soundMock },
      ],
    });
    service = TestBed.inject(PerceptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return nothing message if no adjacent interesting cells', () => {
    const adjacent: Cell[] = [{ x: 0, y: 1, visited: false }];
    const msg = service.getPerceptionMessage(adjacent);
    expect(msg).toBe('gameMessages.perceptionNothingSuspicious');
  });

  it('should return stench if wumpus is adjacent', () => {
    const adjacent: Cell[] = [{ x: 0, y: 1, visited: false, content: { type: 'wumpus' } as any }];
    const msg = service.getPerceptionMessage(adjacent);
    expect(msg).toContain('gameMessages.perceptionStench');
  });

  it('should de-duplicate hazards and play sound only once', () => {
    const adjacent: Cell[] = [
      { x: 0, y: 1, visited: false, content: { type: 'wumpus' } as any },
      { x: 1, y: 0, visited: false, content: { type: 'wumpus' } as any },
    ];

    const msg = service.getPerceptionMessage(adjacent);
    // Message should only contain the stench message once
    expect(msg).toBe('gameMessages.perceptionStench');
    // Sound should only be played once
    expect(soundMock.playSound).toHaveBeenCalledTimes(1);
  });
});
