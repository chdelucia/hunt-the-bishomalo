import { TestBed } from '@angular/core/testing';

import { GameStoreService } from './game-store.service';
import { Direction, GameSettings } from 'src/app/models';

describe('GameStoreService', () => {
  let service: GameStoreService;

  const mockSettings: GameSettings = {
    player: 'Chris',
    size: 4,
    pits: 2,
    arrows: 3,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameStoreService);
    service.setSettings(mockSettings);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize board with correct size and elements', () => {
    service.initBoard();
    const board = service.board();
    expect(board.length).toBe(mockSettings.size);
    expect(board[0].length).toBe(mockSettings.size);

    let goldCount = 0;
    let wumpusCount = 0;
    let pitCount = 0;

    for (const row of board) {
      for (const cell of row) {
        if (cell.hasGold) goldCount++;
        if (cell.hasWumpus) wumpusCount++;
        if (cell.hasPit) pitCount++;
      }
    }

    expect(goldCount).toBe(1);
    expect(wumpusCount).toBe(1);
    expect(pitCount).toBe(mockSettings.pits);
  });

  it('should reset hunter with settings after board initialization', () => {
    service.initBoard();
    const hunter = service.hunter();
    expect(hunter.x).toBe(0);
    expect(hunter.y).toBe(0);
    expect(hunter.direction).toBe(Direction.RIGHT);
    expect(hunter.arrows).toBe(mockSettings.arrows);
    expect(hunter.alive).toBe(true);
    expect(hunter.hasGold).toBe(false);
  });

  it('should update hunter state', () => {
    service.updateHunter({ x: 2, y: 3 });
    const hunter = service.hunter();
    expect(hunter.x).toBe(2);
    expect(hunter.y).toBe(3);
  });

  it('should update board state', () => {
    const newBoard = [
      [{ x: 0, y: 0, visited: true, hasGold: false, hasPit: false, hasWumpus: false, isStart: true }]
    ];
    service.updateBoard(newBoard as any);
    expect(service.board()).toEqual(newBoard);
  });

  it('should set a message', () => {
    service.setMessage('Hello hunter!');
    expect(service.message()).toBe('Hello hunter!');
  });

  it('should return current cell of hunter', () => {
    service.initBoard();
    const cell = service.getCurrentCell();
    expect(cell.x).toBe(0);
    expect(cell.y).toBe(0);
    expect(cell.isStart).toBe(true);
  });

  it('should mark a cell as visited', () => {
    service.initBoard();
    service.markCellVisited(1, 1);
    const cell = service.board()[1][1];
    expect(cell.visited).toBe(true);
  });

  it('should store and expose settings and start time', () => {
    service.initBoard();
    expect(service.settings).toEqual(mockSettings);
    expect(service.startTime).toBeInstanceOf(Date);
  });
});
