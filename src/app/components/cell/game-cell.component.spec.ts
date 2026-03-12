import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameCellComponent } from './game-cell.component';
import { Cell, Chars, Hunter } from '@hunt-the-bishomalo/data';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/core/utils';
import { GameStore } from '@hunt-the-bishomalo/core/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const mockCell: Cell = { x: 2, y: 3 };
const mockHunter: Hunter = {
  x: 2,
  y: 3,
  direction: 1,
  arrows: 1,
  hasGold: false,
  gold: 0,
  inventory: [],
};
const mockSettings = {
  player: 'Chris',
  size: 4,
  pits: 2,
  arrows: 3,
  wumpus: 1,
  selectedChar: Chars.DEFAULT,
};

const mockGameState = {
  hunter: jest.fn().mockReturnValue(mockHunter),
  settings: jest.fn().mockReturnValue(mockSettings),
  blackout: jest.fn().mockReturnValue(false),
  board: jest.fn().mockReturnValue([]),
  message: jest.fn().mockReturnValue(''),
  wumpusKilled: jest.fn().mockReturnValue(0),
  hasGold: jest.fn(),
  inventory: jest.fn().mockReturnValue([]),
  isAlive: jest.fn(),
  hasWon: jest.fn(),
  currentCell: jest.fn().mockReturnValue(mockCell),
  arrows: jest.fn().mockReturnValue(1),
  lives: jest.fn().mockReturnValue(4),
};

describe('GameCellComponent', () => {
  let component: GameCellComponent;
  let fixture: ComponentFixture<GameCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCellComponent, getTranslocoTestingModule()],
      providers: [{ provide: GameStore, useValue: mockGameState }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GameCellComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('cell', mockCell);

    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect hunter on this cell (isHunterCell)', () => {
    const result = component.isHunterCell();
    expect(result).toBe(true);
  });

  it('should show elements when game is not alive', () => {
    mockGameState.isAlive.mockReturnValue(false);
    mockGameState.hasWon.mockReturnValue(false);

    fixture.componentRef.setInput('cell', {
      visited: false,
      content: { image: 'algo.png' },
      x: 1,
      y: 2,
    });
    fixture.detectChanges();

    expect(component.showElements()).toBeTruthy();
  });

  it('should show elements when game secret', () => {
    mockGameState.isAlive.mockReturnValue(true);
    mockGameState.hasWon.mockReturnValue(false);

    fixture.componentRef.setInput('cell', {
      visited: false,
      content: { image: 'algo.png', alt: 'secret' },
      x: 0,
      y: 0,
    });
    fixture.detectChanges();

    expect(component.showElements()).toBeTruthy();
  });

  it('should show elements when game secretv2', () => {
    mockGameState.isAlive.mockReturnValue(true);
    mockGameState.hasWon.mockReturnValue(false);

    fixture.componentRef.setInput('cell', {
      content: { image: 'algo.png', alt: 'secretss' },
    });

    expect(component.showElements()).toBeFalsy();
  });

  it('should show elements when die', () => {
    mockGameState.isAlive.mockReturnValue(false);
    mockGameState.hasWon.mockReturnValue(false);

    fixture.componentRef.setInput('cell', {
      visited: false,
      content: { image: 'algo.png', visited: true },
      x: 1,
      y: 2,
    });
    fixture.detectChanges();

    expect(component.showElements()).toBeTruthy();
  });

  it('should show elements when game has been won', () => {
    mockGameState.isAlive.mockReturnValue(true);
    mockGameState.hasWon.mockReturnValue(true);

    fixture.componentRef.setInput('cell', {
      visited: false,
      content: { image: 'algo.png' },
      x: 1,
      y: 2,
    });

    expect(component.showElements()).toBeTruthy();
  });

  it('should show elements when cell has been visited', () => {
    mockGameState.isAlive.mockReturnValue(true);
    mockGameState.hasWon.mockReturnValue(false);

    fixture.componentRef.setInput('cell', {
      visited: true,
      content: { image: 'algo.png' },
      x: 1,
      y: 2,
    });

    expect(component.showElements()).toBeTruthy();
  });

  it('should show elements when content alt is secret', () => {
    mockGameState.isAlive.mockReturnValue(true);
    mockGameState.hasWon.mockReturnValue(false);

    fixture.componentRef.setInput('cell', {
      visited: false,
      content: { alt: 'secret' },
      x: 1,
      y: 2,
    });

    expect(component.showElements()).toBeTruthy();
  });

  it('should not show elements when game is alive, not won, not dev, not visited, and alt is not secret', () => {
    mockGameState.isAlive.mockReturnValue(true);
    mockGameState.hasWon.mockReturnValue(false);

    fixture.componentRef.setInput('cell', {
      visited: false,
      content: { alt: 'somethingElse' },
      x: 1,
      y: 2,
    });

    expect(component.showElements()).toBeFalsy();
  });

  it('should show hunter when cell has hunter and player is alive', () => {
    mockGameState.isAlive.mockReturnValue(true);
    fixture.componentRef.setInput('cell', mockCell);
    fixture.detectChanges();
    expect(component.showHunter()).toBeTruthy();
  });

  it('should not show hunter when player is dead', () => {
    mockGameState.isAlive.mockReturnValue(false);
    fixture.componentRef.setInput('cell', {
      visited: false,
      content: { alt: 'somethingElse', image: 'algo.png' },
      x: 2,
      y: 3,
    });

    expect(component.showHunter()).toBeFalsy();
  });

  it('should not show hunter when cell is not hunter', () => {
    mockGameState.isAlive.mockReturnValue(true);
    fixture.componentRef.setInput('cell', {
      visited: false,
      content: { alt: 'somethingElse', image: 'algo.png' },
      x: 1,
      y: 1,
    });

    expect(component.showHunter()).toBeFalsy();
  });

  it('should have lantern when in inventory and blackout is active', () => {
    mockGameState.inventory.mockReturnValue([{ effect: 'lantern' }]);
    mockGameState.blackout.mockReturnValue(true);

    const fixtureLocal = TestBed.createComponent(GameCellComponent);
    fixtureLocal.componentRef.setInput('cell', mockCell);
    fixtureLocal.detectChanges();

    expect(fixtureLocal.componentInstance.hasLantern()).toBeTruthy();
  });

  it('should NOT have lantern when in inventory but blackout is NOT active', () => {
    mockGameState.inventory.mockReturnValue([{ effect: 'lantern' }]);
    mockGameState.blackout.mockReturnValue(false);

    const fixtureLocal = TestBed.createComponent(GameCellComponent);
    fixtureLocal.componentRef.setInput('cell', mockCell);
    fixtureLocal.detectChanges();

    expect(fixtureLocal.componentInstance.hasLantern()).toBeFalsy();
  });
});
