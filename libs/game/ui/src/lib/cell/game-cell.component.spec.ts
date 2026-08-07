import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameCellComponent } from './game-cell.component';
import { Cell } from '@hunt-the-bishomalo/shared-data';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';

const mockCell: Cell = { x: 2, y: 3, visited: true };

describe('GameCellComponent', () => {
  let fixture: ComponentFixture<GameCellComponent>;
  let component: GameCellComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCellComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(GameCellComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('cell', mockCell);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply visited class when cell is visited', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cellElement = compiled.querySelector('.cell');
    expect(cellElement?.classList.contains('visited')).toBe(true);
  });

  it('should apply active class when active is true', () => {
    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const cellElement = compiled.querySelector('.cell');
    expect(cellElement?.classList.contains('active')).toBe(true);
  });
});
