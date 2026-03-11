import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameControlsComponent } from './game-controls.component';
import { GameEngineService, ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/core/services';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/core/utils';
import { provideRouter } from '@angular/router';
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
});
