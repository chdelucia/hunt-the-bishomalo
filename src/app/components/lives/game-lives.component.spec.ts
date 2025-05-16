import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameLivesComponent } from './game-lives.component';

describe('GameIvesComponent', () => {
  let component: GameLivesComponent;
  let fixture: ComponentFixture<GameLivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameLivesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameLivesComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('lives', 6);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
