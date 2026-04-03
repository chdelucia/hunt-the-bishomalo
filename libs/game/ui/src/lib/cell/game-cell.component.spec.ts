import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameCellComponent } from './game-cell.component';
import { Cell, Chars, Hunter } from '@hunt-the-bishomalo/shared-data';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';
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

describe('GameCellComponent', () => {
  let component: GameCellComponent;
  let fixture: ComponentFixture<GameCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCellComponent, getTranslocoTestingModule()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GameCellComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('cell', mockCell);
    fixture.componentRef.setInput('selectedChar', Chars.DEFAULT);
    fixture.componentRef.setInput('size', 4);
    fixture.componentRef.setInput('isHunterCell', true);
    fixture.componentRef.setInput('hunterDirection', mockHunter.direction);
    fixture.componentRef.setInput('hunterArrows', mockHunter.arrows);
    fixture.componentRef.setInput('hunterHasGold', mockHunter.hasGold);
    fixture.componentRef.setInput('showElements', false);
    fixture.componentRef.setInput('showHunter', true);
    fixture.componentRef.setInput('hasLantern', false);
    fixture.componentRef.setInput('hasShield', false);

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

  it('should show elements when showElements input is true', () => {
    fixture.componentRef.setInput('showElements', true);
    fixture.detectChanges();
    expect(component.showElements()).toBeTruthy();
  });

  it('should show hunter when showHunter input is true', () => {
    fixture.componentRef.setInput('showHunter', true);
    fixture.detectChanges();
    expect(component.showHunter()).toBeTruthy();
  });

  it('should have lantern when hasLantern input is true', () => {
    fixture.componentRef.setInput('hasLantern', true);
    fixture.detectChanges();
    expect(component.hasLantern()).toBeTruthy();
  });

  it('should have shield when hasShield input is true', () => {
    fixture.componentRef.setInput('hasShield', true);
    fixture.detectChanges();
    expect(component.hasShield()).toBeTruthy();
  });
});
