import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameShell } from './game-shell';

describe('GameShell', () => {
  let component: GameShell;
  let fixture: ComponentFixture<GameShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameShell],
    }).compileComponents();

    fixture = TestBed.createComponent(GameShell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
