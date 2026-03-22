import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameControlsComponent } from './game-controls.component';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';
import { By } from '@angular/platform-browser';

describe('GameControlsComponent', () => {
  let component: GameControlsComponent;
  let fixture: ComponentFixture<GameControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameControlsComponent, getTranslocoTestingModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(GameControlsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('soundEnabled', true);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit resetGameRequested', () => {
    const spy = jest.spyOn(component.resetGameRequested, 'emit');
    component.resetGame();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit newGameRequested', () => {
    const spy = jest.spyOn(component.newGameRequested, 'emit');
    component.newGame();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit navigateToControlsRequested', () => {
    const spy = jest.spyOn(component.navigateToControlsRequested, 'emit');
    component.navigateToControls();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit moveForwardRequested', () => {
    const spy = jest.spyOn(component.moveForwardRequested, 'emit');
    component.moveForward();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit turnLeftRequested', () => {
    const spy = jest.spyOn(component.turnLeftRequested, 'emit');
    component.turnLeft();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit turnRightRequested', () => {
    const spy = jest.spyOn(component.turnRightRequested, 'emit');
    component.turnRight();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit shootArrowRequested', () => {
    const spy = jest.spyOn(component.shootArrowRequested, 'emit');
    component.shootArrow();
    expect(spy).toHaveBeenCalled();
  });

  it('should toggle isVisible', () => {
    expect(component.isVisible()).toBe(false);
    component.toggle();
    expect(component.isVisible()).toBe(true);
    component.toggle();
    expect(component.isVisible()).toBe(false);
  });

  it('should emit toggleSoundRequested when toggleSound() is called', () => {
    const spy = jest.spyOn(component.toggleSoundRequested, 'emit');
    component.toggleSound();
    expect(spy).toHaveBeenCalled();
  });

  it('should call toggleSound when sound button is clicked', () => {
    component.isVisible.set(true);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.sound-toggle'));
    const spy = jest.spyOn(component, 'toggleSound');
    button.nativeElement.click();
    expect(spy).toHaveBeenCalled();
  });
});
