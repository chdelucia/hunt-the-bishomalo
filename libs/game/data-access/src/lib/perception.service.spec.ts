import { TestBed } from '@angular/core/testing';
import { PerceptionService } from './perception.service';
import { TranslocoService } from '@jsverse/transloco';
import { GameSoundService } from '@hunt-the-bishomalo/core/services';
import { Cell, CELL_CONTENTS, GameSound } from '@hunt-the-bishomalo/data';
import { of } from 'rxjs';

describe('PerceptionService', () => {
  let service: PerceptionService;
  let translocoMock: any;
  let soundMock: any;

  beforeEach(() => {
    translocoMock = {
      translate: jest.fn(key => key),
      selectTranslate: jest.fn(() => of('nothing')),
    };
    soundMock = {
      playSound: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        PerceptionService,
        { provide: TranslocoService, useValue: translocoMock },
        { provide: GameSoundService, useValue: soundMock },
      ],
    });
    service = TestBed.inject(PerceptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return nothing message if no adjacent interesting cells', (done) => {
    const adjacent: Cell[] = [{ x: 0, y: 1, visited: false }];
    service.getPerceptionMessage(adjacent).subscribe(msg => {
      expect(msg).toBe('nothing');
      done();
    });
  });

  it('should return stench if wumpus is adjacent', (done) => {
    const adjacent: Cell[] = [{ x: 0, y: 1, visited: false, content: { type: 'wumpus' } as any }];
    service.getPerceptionMessage(adjacent).subscribe(msg => {
      expect(msg).toContain('gameMessages.perceptionStench');
      done();
    });
  });
});
