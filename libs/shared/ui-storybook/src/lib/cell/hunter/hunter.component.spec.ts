import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HunterComponent } from './hunter.component';
import { Chars, Direction } from '@hunt-the-bishomalo/data';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';

describe('HunterComponent', () => {
  let component: HunterComponent;
  let fixture: ComponentFixture<HunterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HunterComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(HunterComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('direction', Direction.RIGHT);
    fixture.componentRef.setInput('arrows', 1);
    fixture.componentRef.setInput('selectedChar', Chars.DEFAULT);
    fixture.componentRef.setInput('hasGold', false);
    fixture.componentRef.setInput('size', 8);
    fixture.componentRef.setInput('hasLantern', false);
    fixture.componentRef.setInput('hasShield', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return 270 when direction is UP', () => {
    fixture.componentRef.setInput('direction', Direction.UP);
    expect(component.rotation()).toBe(270);
  });

  it('should return 0 when direction is RIGHT', () => {
    fixture.componentRef.setInput('direction', Direction.RIGHT);
    expect(component.rotation()).toBe(0);
  });

  it('should return 90 when direction is DOWN', () => {
    fixture.componentRef.setInput('direction', Direction.DOWN);
    expect(component.rotation()).toBe(90);
  });

  it('should return 180 when direction is LEFT', () => {
    fixture.componentRef.setInput('direction', Direction.LEFT);
    expect(component.rotation()).toBe(180);
  });

  it('should return correct bow image for default char with arrows', () => {
    fixture.componentRef.setInput('selectedChar', Chars.DEFAULT);
    fixture.componentRef.setInput('arrows', 1);
    expect(component.bowImage()).toBe('chars/default/bow.svg');
  });

  it('should return empty bow image for default char without arrows', () => {
    fixture.componentRef.setInput('selectedChar', Chars.DEFAULT);
    fixture.componentRef.setInput('arrows', 0);
    expect(component.bowImage()).toBe('chars/default/bowempty.svg');
  });

  it('should show gold icon when hasGold is true and size is less than 12', () => {
    fixture.componentRef.setInput('hasGold', true);
    fixture.componentRef.setInput('size', 10);
    expect(component.showGoldIcon()).toBe(true);
  });

  it('should not show gold icon when hasGold is false', () => {
    fixture.componentRef.setInput('hasGold', false);
    fixture.componentRef.setInput('size', 10);
    expect(component.showGoldIcon()).toBe(false);
  });

  it('should not show gold icon when size is 12 or more', () => {
    fixture.componentRef.setInput('hasGold', true);
    fixture.componentRef.setInput('size', 12);
    expect(component.showGoldIcon()).toBe(false);
  });
});
