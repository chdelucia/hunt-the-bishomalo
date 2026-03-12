import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameControlsComponent } from './game-controls.component';
import { GameEngineService, ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/core/services';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/core/utils';
import { provideRouter, Router } from '@angular/router';
import { RouteTypes } from '@hunt-the-bishomalo/data';

const mockGameService = {
  moveForward: jest.fn(),
  turnLeft: jest.fn(),
  turnRight: jest.fn(),
  shootArrow: jest.fn(),
  exit: jest.fn(),
  initGame: jest.fn(),
  newGame: jest.fn(),
};

const achievementServiceMock = {
  activeAchievement: jest.fn(),
};

describe('GameControlsComponent', () => {
  let component: GameControlsComponent;
  let fixture: ComponentFixture<GameControlsComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameControlsComponent, getTranslocoTestingModule()],
      providers: [
        { provide: GameEngineService, useValue: mockGameService },
        { provide: ACHIEVEMENT_SERVICE, useValue: achievementServiceMock },
        provideRouter([
          { path: RouteTypes.SETTINGS, redirectTo: '' },
          { path: RouteTypes.RULES, redirectTo: '' },
        ]),
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

  it('should reset same level', () => {
    component.resetGame();
    expect(mockGameService.initGame).toHaveBeenCalled();
  });

  it('should call newGame and navigate to settings', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.newGame();
    expect(mockGameService.newGame).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith([RouteTypes.SETTINGS]);
  });

  it('should navigate to rules', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.navigateToControls();
    expect(navigateSpy).toHaveBeenCalledWith([RouteTypes.RULES]);
  });

  it('should call moveForward', () => {
    component.moveForward();
    expect(mockGameService.moveForward).toHaveBeenCalled();
  });

  it('should call turnLeft', () => {
    component.turnLeft();
    expect(mockGameService.turnLeft).toHaveBeenCalled();
  });

  it('should call turnRight', () => {
    component.turnRight();
    expect(mockGameService.turnRight).toHaveBeenCalled();
  });

  it('should call shootArrow', () => {
    component.shootArrow();
    expect(mockGameService.shootArrow).toHaveBeenCalled();
  });

  it('should toggle isVisible', () => {
    expect(component.isVisible()).toBe(false);
    component.toggle();
    expect(component.isVisible()).toBe(true);
    component.toggle();
    expect(component.isVisible()).toBe(false);
  });
});
