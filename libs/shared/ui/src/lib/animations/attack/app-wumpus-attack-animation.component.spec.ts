import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppWumpusAttackAnimationComponent } from './app-wumpus-attack-animation.component';

describe('AppWumpusAttackAnimationComponent', () => {
  let component: AppWumpusAttackAnimationComponent;
  let fixture: ComponentFixture<AppWumpusAttackAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppWumpusAttackAnimationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppWumpusAttackAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update step over time and emit closeAnimation', fakeAsync(() => {
    fixture.detectChanges();

    expect(component.step()).toBe(1);
    tick(3500);
    expect(component.step()).toBe(1);
  }));

  it('should return correct player position', () => {
    component.step.set(1);
    expect(component.getPlayerLeft()).toBe('-100px');

    component.step.set(3);
    expect(component.getPlayerLeft()).toBe('0');

    component.step.set(5);
    expect(component.getPlayerLeft()).toBe('40px');
  });

  it('should return correct wumpus scale', () => {
    component.step.set(1);
    expect(component.getWumpusScale()).toBe(1);

    component.step.set(3);
    expect(component.getWumpusScale()).toBe(1.5);

    component.step.set(5);
    expect(component.getWumpusScale()).toBe(2);
  });
});
