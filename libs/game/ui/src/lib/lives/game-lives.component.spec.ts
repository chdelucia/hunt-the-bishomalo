import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameLivesComponent } from './game-lives.component';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';

describe('GameLivesComponent', () => {
  let component: GameLivesComponent;
  let fixture: ComponentFixture<GameLivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameLivesComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(GameLivesComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('lives', 6);
    fixture.componentRef.setInput('maxLives', 8);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct livesArray length matching maxLives input', () => {
    expect(component.livesArray().length).toBe(component.maxLives());
  });

  it('should display the correct accessible lives status', () => {
    const srOnlyElement = fixture.nativeElement.querySelector('.sr-only');
    expect(srOnlyElement).toBeTruthy();
    // Since we're using the testing module with empty langs by default,
    // it will return the key or we can provide the translations in the test.
    // The default behavior of TranslocoTestingModule is to return the key if no translation is found.
    expect(srOnlyElement.textContent).toContain('lives.status');
  });
});
