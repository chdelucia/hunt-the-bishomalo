import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameControlsComponent } from './game-controls.component';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';
import { provideRouter, Router } from '@angular/router';
import { RouteTypes } from '@hunt-the-bishomalo/data';
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('GameControlsComponent', () => {
  let component: GameControlsComponent;
  let fixture: ComponentFixture<GameControlsComponent>;
  let router: Router;
  let gameStoreMock: any;

  beforeEach(async () => {
    gameStoreMock = {
      settings: signal({}),
      soundEnabled: signal(true),
      updateGame: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [GameControlsComponent, getTranslocoTestingModule()],
      providers: [
        provideRouter([
          { path: RouteTypes.SETTINGS, redirectTo: '' },
          { path: RouteTypes.RULES, redirectTo: '' },
        ]),
        { provide: GAME_STORE_TOKEN, useValue: gameStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameControlsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
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

  it('should emit newGameRequested and navigate to settings', () => {
    const spy = jest.spyOn(component.newGameRequested, 'emit');
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.newGame();
    expect(spy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith([RouteTypes.SETTINGS]);
  });

  it('should navigate to rules', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.navigateToControls();
    expect(navigateSpy).toHaveBeenCalledWith([RouteTypes.RULES]);
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

  it('should toggle sound', () => {
    gameStoreMock.soundEnabled.set(true);
    component.toggleSound();
    expect(gameStoreMock.updateGame).toHaveBeenCalledWith({
      settings: expect.objectContaining({ soundEnabled: false }),
    });

    gameStoreMock.soundEnabled.set(false);
    component.toggleSound();
    expect(gameStoreMock.updateGame).toHaveBeenCalledWith({
      settings: expect.objectContaining({ soundEnabled: true }),
    });
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
