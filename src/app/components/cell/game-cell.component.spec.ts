import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameCellComponent } from './game-cell.component';
import { Cell, Hunter } from 'src/app/models';

const mockCell: Cell = { x: 2, y: 3 };
const mockHunter: Hunter = { x: 2, y: 3, direction: 1, arrows: 1, hasGold: false, alive: true, hasWon: false };

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
    expect(component.bowImage()).toBe('bow.svg');
  });

  it('should return bowgold.svg if hunter has gold and arrows', () => {
    fixture.componentRef.setInput('hunter', { ...mockHunter, hasGold: true });
    fixture.detectChanges();
    expect(component.bowImage()).toBe('bowgold.svg');
  });

  it('should return bowgoldempty.svg if hunter has gold but no arrows', () => {
    fixture.componentRef.setInput('hunter', { ...mockHunter, hasGold: true, arrows: 0 });
    fixture.detectChanges();
    expect(component.bowImage()).toBe('bowgoldempty.svg');
  });

  it('should return bowempty.svg if hunter has no gold and no arrows', () => {
    fixture.componentRef.setInput('hunter', { ...mockHunter, hasGold: false, arrows: 0 });
    fixture.detectChanges();
    expect(component.bowImage()).toBe('bowempty.svg');
  });
});
