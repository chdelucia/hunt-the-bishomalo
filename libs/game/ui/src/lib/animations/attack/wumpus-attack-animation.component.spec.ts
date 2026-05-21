import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppWumpusAttackAnimationComponent } from './wumpus-attack-animation.component';

describe('AppWumpusAttackAnimationComponent', () => {
  let component: AppWumpusAttackAnimationComponent;
  let fixture: ComponentFixture<AppWumpusAttackAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppWumpusAttackAnimationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppWumpusAttackAnimationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('selectedChar', 'default');
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set step to 5 immediately and NOT emit closeAnimation automatically', () => {
    const testFixture = TestBed.createComponent(AppWumpusAttackAnimationComponent);
    const testComponent = testFixture.componentInstance;
    testFixture.componentRef.setInput('selectedChar', 'default');

    const spy = jest.spyOn(testComponent.closeAnimation, 'emit');

    testFixture.detectChanges();

    expect(testComponent.step()).toBe(5);
    expect(spy).not.toHaveBeenCalled();
  });

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

    component.step.set(2);
    expect(component.getWumpusScale()).toBe(1.2);

    component.step.set(3);
    expect(component.getWumpusScale()).toBe(1.5);

    component.step.set(4);
    expect(component.getWumpusScale()).toBe(1.8);

    component.step.set(5);
    expect(component.getWumpusScale()).toBe(2);
  });

  it('should return correct player position for all steps', () => {
    component.step.set(1);
    expect(component.getPlayerLeft()).toBe('-100px');

    component.step.set(2);
    expect(component.getPlayerLeft()).toBe('-50px');

    component.step.set(3);
    expect(component.getPlayerLeft()).toBe('0');

    component.step.set(4);
    expect(component.getPlayerLeft()).toBe('20px');

    component.step.set(5);
    expect(component.getPlayerLeft()).toBe('40px');
  });
});
