import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameCellComponent } from './game-cell.component';
import { Cell, Chars, Hunter } from 'src/app/models';

const mockCell: Cell = { x: 2, y: 3 };
const mockHunter: Hunter = {
  x: 2,
  y: 3,
  direction: 1,
  arrows: 1,
  hasGold: false,
  alive: true,
  hasWon: false,
  lives: 4,
  wumpusKilled: 0,
};
const mockSettings = {
  player: 'Chris',
  size: 4,
  pits: 2,
  arrows: 3,
  wumpus: 1,
  selectedChar: Chars.DEFAULT,
};

describe('GameCellComponent', () => {
  let component: GameCellComponent;
  let fixture: ComponentFixture<GameCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameCellComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('cell', mockCell);
    fixture.componentRef.setInput('hunter', mockHunter);
    fixture.componentRef.setInput('settings', mockSettings);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect hunter on this cell (isHunterCell)', () => {
    const result = component.isHunterCell(mockCell)();
    expect(result).toBe(true);
  });

  it('should return correct rotation based on direction', () => {
    expect(component.rotation()).toBe(0);
  });

  it('should return correct bow image (bow.svg) for hunter with arrows and no gold', () => {
    expect(component.bowImage()).toContain('bow.svg');
  });

  it('should return bowgold.svg if hunter has gold and arrows', () => {
    fixture.componentRef.setInput('hunter', { ...mockHunter, hasGold: true });
    fixture.detectChanges();
    expect(component.bowImage()).toContain('bow.svg');
  });

  it('should return bowgoldempty.svg if hunter has gold but no arrows', () => {
    fixture.componentRef.setInput('hunter', { ...mockHunter, hasGold: true, arrows: 0 });
    fixture.detectChanges();
    expect(component.bowImage()).toContain('bowempty.svg');
  });

  it('should return bowempty.svg if hunter has no gold and no arrows', () => {
    fixture.componentRef.setInput('hunter', { ...mockHunter, hasGold: false, arrows: 0 });
    fixture.detectChanges();
    expect(component.bowImage()).toContain('bowempty.svg');
  });

  function setHunterDirection(direction: number) {
    fixture.componentRef.setInput('hunter', { direction });
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
});
