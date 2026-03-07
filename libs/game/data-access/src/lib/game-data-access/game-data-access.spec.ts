import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameDataAccess } from './game-data-access';

describe('GameDataAccess', () => {
  let component: GameDataAccess;
  let fixture: ComponentFixture<GameDataAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameDataAccess],
    }).compileComponents();

    fixture = TestBed.createComponent(GameDataAccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
