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
    fixture.componentRef.setInput('isAlive', true);
    fixture.componentRef.setInput('hasWon', false);
    fixture.componentRef.setInput('inventory', []);
    fixture.componentRef.setInput('selectedChar', Chars.DEFAULT);
    fixture.componentRef.setInput('size', 4);
    fixture.componentRef.setInput('blackout', false);
    fixture.componentRef.setInput('isHunterCell', true);
    fixture.componentRef.setInput('hunter', mockHunter);

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
    fixture.componentRef.setInput('isAlive', false);
    fixture.componentRef.setInput('hasWon', false);

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
    fixture.componentRef.setInput('isAlive', true);
    fixture.componentRef.setInput('hasWon', false);

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
    fixture.componentRef.setInput('isAlive', true);
    fixture.componentRef.setInput('hasWon', false);

    fixture.componentRef.setInput('cell', {
      content: { image: 'algo.png', alt: 'secretss' },
    });

    expect(component.showElements()).toBeFalsy();
  });

  it('should show elements when die', () => {
    fixture.componentRef.setInput('isAlive', false);
    fixture.componentRef.setInput('hasWon', false);

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
    fixture.componentRef.setInput('isAlive', true);
    fixture.componentRef.setInput('hasWon', true);

    fixture.componentRef.setInput('cell', {
      visited: false,
      content: { image: 'algo.png' },
      x: 1,
      y: 2,
    });

    expect(component.showElements()).toBeTruthy();
  });

  it('should show elements when cell has been visited', () => {
    fixture.componentRef.setInput('isAlive', true);
    fixture.componentRef.setInput('hasWon', false);

    fixture.componentRef.setInput('cell', {
      visited: true,
      content: { image: 'algo.png' },
      x: 1,
      y: 2,
    });

    expect(component.showElements()).toBeTruthy();
  });

  it('should show elements when content alt is secret', () => {
    fixture.componentRef.setInput('isAlive', true);
    fixture.componentRef.setInput('hasWon', false);

    fixture.componentRef.setInput('cell', {
      visited: false,
      content: { alt: 'secret' },
      x: 1,
      y: 2,
    });

    expect(component.showElements()).toBeTruthy();
  });

  it('should not show elements when game is alive, not won, not dev, not visited, and alt is not secret', () => {
    fixture.componentRef.setInput('isAlive', true);
    fixture.componentRef.setInput('hasWon', false);

    fixture.componentRef.setInput('cell', {
      visited: false,
      content: { alt: 'somethingElse' },
      x: 1,
      y: 2,
    });

    expect(component.showElements()).toBeFalsy();
  });

  it('should show hunter when cell has hunter and player is alive', () => {
    fixture.componentRef.setInput('isAlive', true);
    fixture.componentRef.setInput('isHunterCell', true);
    fixture.componentRef.setInput('cell', mockCell);
    fixture.detectChanges();
    expect(component.showHunter()).toBeTruthy();
  });

  it('should not show hunter when player is dead', () => {
    fixture.componentRef.setInput('isAlive', false);
    fixture.componentRef.setInput('cell', {
      visited: false,
      content: { alt: 'somethingElse', image: 'algo.png' },
      x: 2,
      y: 3,
    });

    expect(component.showHunter()).toBeFalsy();
  });

  it('should not show hunter when cell is not hunter', () => {
    fixture.componentRef.setInput('isAlive', true);
    fixture.componentRef.setInput('isHunterCell', false);
    fixture.componentRef.setInput('cell', {
      visited: false,
      content: { alt: 'somethingElse', image: 'algo.png' },
      x: 1,
      y: 1,
    });

    expect(component.showHunter()).toBeFalsy();
  });

  it('should have lantern when in inventory and blackout is active', () => {
    fixture.componentRef.setInput('inventory', [{ effect: 'lantern' }]);
    fixture.componentRef.setInput('blackout', true);

    fixture.detectChanges();

    expect(component.hasLantern()).toBeTruthy();
  });

  it('should NOT have lantern when in inventory but blackout is NOT active', () => {
    fixture.componentRef.setInput('inventory', [{ effect: 'lantern' }]);
    fixture.componentRef.setInput('blackout', false);

    fixture.detectChanges();

    expect(component.hasLantern()).toBeFalsy();
  });
});
