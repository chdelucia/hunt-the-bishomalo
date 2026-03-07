import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameApi } from './game-api';

describe('GameApi', () => {
  let component: GameApi;
  let fixture: ComponentFixture<GameApi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameApi],
    }).compileComponents();

    fixture = TestBed.createComponent(GameApi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
