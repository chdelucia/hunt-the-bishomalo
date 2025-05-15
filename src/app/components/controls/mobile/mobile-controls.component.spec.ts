import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileControlsComponent } from './mobile-controls.component';
import { GameEngineService } from 'src/app/services';

  const gameEngineMock = {
    moveForward: jest.fn(),
    turnLeft: jest.fn(),
    turnRight: jest.fn(),
    shootArrow: jest.fn(),
    newGame: jest.fn(),
  }

describe('MobileControlsComponent', () => {
  let component: MobileControlsComponent;
  let fixture: ComponentFixture<MobileControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileControlsComponent],
      providers: [
        { provide: GameEngineService, useValue: gameEngineMock }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call moveForward() when GO button is clicked', () => {
    component.moveForward()
    expect(gameEngineMock.moveForward).toHaveBeenCalled();
  });

  it('should call turnLeft() when rotate button is clicked', () => {
    component.turnRight()
    expect(gameEngineMock.turnRight).toHaveBeenCalled();
  });

  it('should call shootArrow() when shoot button is clicked', () => {
    component.shootArrow()
    expect(gameEngineMock.shootArrow).toHaveBeenCalled();
  });
});
