import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameLevelComponent } from './game-level.component';
import { getTranslocoTestingModule } from 'src/app/utils';

describe('GameLevelComponent', () => {
  let component: GameLevelComponent;
  let fixture: ComponentFixture<GameLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameLevelComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(GameLevelComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('settings', {});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show level number', () => {
    fixture.componentRef.setInput('settings', { size: 6, pits: 2, wumpus: 1 });
    fixture.detectChanges();

    const levelEl = fixture.nativeElement.querySelector('.level');
    expect(levelEl?.textContent).toContain('level.display');
  });
});
