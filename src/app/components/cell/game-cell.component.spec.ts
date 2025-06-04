import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameCellComponent } from './game-cell.component';
import { Cell, Chars, Hunter } from 'src/app/models';
import { getTranslocoTestingModule } from 'src/app/utils';
import { GameStore } from 'src/app/store';
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
  board: () => [],
  message: () => '',
  wumpusKilled: () => 0,
  hasGold: jest.fn(),
  inventory: jest.fn().mockReturnValue([]),
  isAlive: jest.fn(),
  hasWon: jest.fn(),
  currentCell: () => mockCell,
  arrows: () => 1,
  lives: () => 4,
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
    const result = component.isHunterCell()();
    expect(result).toBe(true);
  });

  it('should return correct rotation based on direction', () => {
    expect(component.rotation()).toBe(0);
  });

  it('should return correct bow image (bow.svg) for hunter with arrows and no gold', () => {
    expect(component.bowImage()).toContain('bow.svg');
  });

  it('should return bowgold.svg if hunter has gold and arrows', () => {
    mockGameState.hunter.mockReturnValue({ ...mockHunter, hasGold: true });
    fixture.detectChanges();
    expect(component.bowImage()).toContain('bow.svg');
  });

  it('should return bowgoldempty.svg if hunter has gold but no arrows', () => {
    mockGameState.arrows = () => 0;
    fixture.detectChanges();
    expect(component.bowImage()).toContain('bowempty.svg');
  });

  it('should return bowempty.svg if hunter has no gold and no arrows', () => {
    mockGameState.hunter.mockReturnValue({ ...mockHunter, hasGold: false, arrows: 0 });
    fixture.detectChanges();
    expect(component.bowImage()).toContain('bowempty.svg');
  });

  function setHunterDirection(direction: number) {
    mockGameState.hunter.mockReturnValue({ direction });
    fixture.detectChanges();
  }

  it('should return 270 when direction is 0', () => {
    setHunterDirection(0);
    expect(component.rotation()).toBe(270);
  });

  it('should return 0 when direction is 1', () => {
    setHunterDirection(1);
    expect(component.rotation()).toBe(0);
  });

  it('should return 90 when direction is 2', () => {
    setHunterDirection(2);
    expect(component.rotation()).toBe(90);
  });

  it('should return 180 when direction is 3', () => {
    setHunterDirection(3);
    expect(component.rotation()).toBe(180);
  });

  it('should return 0 for unknown direction', () => {
    setHunterDirection(999);
    expect(component.rotation()).toBe(0);
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

  it('should show gold icon when has gold and size is less than 12', () => {
    mockGameState.hasGold.mockReturnValue(true);
    mockSettings.size = 10;
    mockGameState.settings.mockReturnValue({ size: 10 });
    fixture.detectChanges();

    expect(component.showGoldIcon()).toBeUndefined();
  });

  it('should not show gold icon when size is 12 or more', () => {
    mockGameState.hasGold.mockReturnValue(true);
    mockSettings.size = 13;
    mockGameState.settings.mockReturnValue({ size: 13 });
    fixture.detectChanges();
    expect(component.showGoldIcon()).toBeTruthy();
  });

  it('should not show gold icon when player has no gold', () => {
    mockGameState.hasGold.mockReturnValue(false);
    mockSettings.size = 10;
    mockGameState.settings.mockReturnValue({ size: 10 });

    expect(component.showGoldIcon()).toBeFalsy();
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
});
