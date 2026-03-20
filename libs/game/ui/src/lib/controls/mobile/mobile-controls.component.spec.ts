import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileControlsComponent } from './mobile-controls.component';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { signal } from '@angular/core';

describe('MobileControlsComponent', () => {
  let component: MobileControlsComponent;
  let fixture: ComponentFixture<MobileControlsComponent>;
  let gameStoreMock: any;

  beforeEach(async () => {
    gameStoreMock = {
      settings: signal({}),
      soundEnabled: signal(true),
      updateGame: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MobileControlsComponent, getTranslocoTestingModule()],
      providers: [{ provide: GAME_STORE_TOKEN, useValue: gameStoreMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileControlsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isFinish', false);
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
});
