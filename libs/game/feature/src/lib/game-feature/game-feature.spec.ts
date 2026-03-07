import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameFeature } from './game-feature';

describe('GameFeature', () => {
  let component: GameFeature;
  let fixture: ComponentFixture<GameFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameFeature],
    }).compileComponents();

    fixture = TestBed.createComponent(GameFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
