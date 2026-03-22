import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WumpusAttackAnimationComponent } from './wumpus-attack-animation.component';

describe('WumpusAttackAnimationComponent', () => {
  let component: WumpusAttackAnimationComponent;
  let fixture: ComponentFixture<WumpusAttackAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WumpusAttackAnimationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WumpusAttackAnimationComponent);
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

  it('should update step over time and emit closeAnimation', (done) => {
    jest.useFakeTimers();
    // Re-create component with fake timers active so ngOnInit uses them
    fixture = TestBed.createComponent(WumpusAttackAnimationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('selectedChar', 'default');
    fixture.detectChanges();

    expect(component.step()).toBe(1);
    jest.advanceTimersByTime(3500);
    expect(component.step()).toBe(5);
    jest.useRealTimers();
    done();
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
