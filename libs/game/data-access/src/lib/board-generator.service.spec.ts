import { TestBed } from '@angular/core/testing';
import { BoardGeneratorService } from './board-generator.service';
import { GameSettings, Chars, CELL_CONTENTS } from '@hunt-the-bishomalo/shared-data';

describe('BoardGeneratorService', () => {
  let service: BoardGeneratorService;
  const mockSettings: GameSettings = {
    player: 'Test',
    size: 4,
    pits: 2,
    arrows: 1,
    wumpus: 1,
    selectedChar: Chars.DEFAULT,
    difficulty: {
      maxLevels: 10,
      maxChance: 0.3,
      baseChance: 0.1,
      gold: 50,
      maxLives: 8,
      luck: 5,
      bossTries: 3,
    },
    startTime: '',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardGeneratorService);
  });

  it('should create a board and place items', () => {
    const board = service.createBoard(mockSettings);
    expect(board.length).toBe(4);

    service.placeGold(board, mockSettings);
    expect(board.flat().some(c => c.content === CELL_CONTENTS.gold)).toBe(true);

    service.placeWumpus(board, mockSettings);
    expect(board.flat().some(c => c.content?.type === 'wumpus')).toBe(true);

    service.placePits(board, mockSettings);
    expect(board.flat().some(c => c.content === CELL_CONTENTS.pit)).toBe(true);

    service.placeArrows(board, { ...mockSettings, wumpus: 2 });
    expect(board.flat().some(c => c.content === CELL_CONTENTS.arrow)).toBe(true);
  });

  it('should place events', () => {
    const board = service.createBoard(mockSettings);
    service.placeEvents(board, mockSettings, 5, 0);
  });

  it('should calculate counts', () => {
    expect(service.calculatePits(10, 5)).toBeGreaterThan(0);
    expect(service.calculateWumpus(10, 5)).toBeGreaterThan(0);
  });
});
