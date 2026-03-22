import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileControlsComponent } from './mobile-controls.component';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';

describe('MobileControlsComponent', () => {
  let component: MobileControlsComponent;
  let fixture: ComponentFixture<MobileControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileControlsComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileControlsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isFinish', false);
    fixture.componentRef.setInput('soundEnabled', true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit moveForwardRequested when moveForward() is called', () => {
    const spy = jest.spyOn(component.moveForwardRequested, 'emit');
    component.moveForward();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit turnRightRequested when turnRight() is called', () => {
    const spy = jest.spyOn(component.turnRightRequested, 'emit');
    component.turnRight();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit shootArrowRequested when shootArrow() is called', () => {
    const spy = jest.spyOn(component.shootArrowRequested, 'emit');
    component.shootArrow();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit turnLeftRequested when turnLeft() is called', () => {
    const spy = jest.spyOn(component.turnLeftRequested, 'emit');
    component.turnLeft();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit toggleSoundRequested when toggleSound() is called', () => {
    const spy = jest.spyOn(component.toggleSoundRequested, 'emit');
    component.toggleSound();
    expect(spy).toHaveBeenCalled();
  });
});
