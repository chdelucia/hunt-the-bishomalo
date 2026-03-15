import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileControlsComponent } from './mobile-controls.component';
import { GameEngineService } from '@hunt-the-bishomalo/game/data-access';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/core/utils';

const gameEngineMock = {
  moveForward: jest.fn(),
  turnLeft: jest.fn(),
  turnRight: jest.fn(),
  shootArrow: jest.fn(),
  newGame: jest.fn(),
};

const achievementServiceMock = {
  activeAchievement: jest.fn(),
};

describe('MobileControlsComponent', () => {
  let component: MobileControlsComponent;
  let fixture: ComponentFixture<MobileControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileControlsComponent, getTranslocoTestingModule()],
      providers: [
        { provide: GameEngineService, useValue: gameEngineMock },
        { provide: ACHIEVEMENT_SERVICE, useValue: achievementServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileControlsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isFinish', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call moveForward() when GO button is clicked', () => {
    component.moveForward();
    expect(gameEngineMock.moveForward).toHaveBeenCalled();
  });

  it('should call turnLeft() when rotate button is clicked', () => {
    component.turnRight();
    expect(gameEngineMock.turnRight).toHaveBeenCalled();
  });

  it('should call shootArrow() when shoot button is clicked', () => {
    component.shootArrow();
    expect(gameEngineMock.shootArrow).toHaveBeenCalled();
  });
});
