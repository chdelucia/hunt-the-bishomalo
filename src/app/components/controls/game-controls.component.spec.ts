import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameControlsComponent } from './game-controls.component';
import { GameEngineService } from 'src/app/services';


  const mockGameService = {
    moveForward: jest.fn(),
    turnLeft: jest.fn(),
    turnRight: jest.fn(),
    shootArrow: jest.fn(),
    exit: jest.fn(),
    initGame: jest.fn(),
  };

describe('GameControlsComponent', () => {
  let component: GameControlsComponent;
  let fixture: ComponentFixture<GameControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameControlsComponent],
      providers: [
        { provide: GameEngineService, useValue: mockGameService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameControlsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('arrows', 2);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call moveForward() on ArrowUp key', () => {
    const event = new KeyboardEvent('keydown', { code: 'ArrowUp' });
    window.dispatchEvent(event);
    expect(mockGameService.moveForward).toHaveBeenCalled();
  });

  it('should call turnLeft() on ArrowLeft key', () => {
    const event = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
    window.dispatchEvent(event);
    expect(mockGameService.turnLeft).toHaveBeenCalled();
  });

  it('should call turnRight() on ArrowRight key', () => {
    const event = new KeyboardEvent('keydown', { code: 'ArrowRight' });
    window.dispatchEvent(event);
    expect(mockGameService.turnRight).toHaveBeenCalled();
  });

  it('should call shootArrow() on Enter key', () => {
    const event = new KeyboardEvent('keydown', { code: 'Enter' });
    window.dispatchEvent(event);
    expect(mockGameService.shootArrow).toHaveBeenCalled();
  });

  it('should call initGame() on R key', () => {
    const event = new KeyboardEvent('keydown', { code: 'KeyR' });
    window.dispatchEvent(event);
    expect(mockGameService.initGame).toHaveBeenCalled();
  });

  it('should call exit() on Escape key', () => {
    const event = new KeyboardEvent('keydown', { code: 'Escape' });
    window.dispatchEvent(event);
    expect(mockGameService.exit).toHaveBeenCalled();
  });

  it('should prevent default behavior for recognized keys', () => {
    const preventDefault = jest.fn();
    const event = new KeyboardEvent('keydown', { code: 'ArrowUp' });
    Object.defineProperty(event, 'preventDefault', { value: preventDefault });

    window.dispatchEvent(event);
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should not call anything for unrelated key', () => {
    const event = new KeyboardEvent('keydown', { code: 'KeyX' });
    window.dispatchEvent(event);

    expect(mockGameService.moveForward).not.toHaveBeenCalled();
    expect(mockGameService.turnLeft).not.toHaveBeenCalled();
    expect(mockGameService.turnRight).not.toHaveBeenCalled();
    expect(mockGameService.shootArrow).not.toHaveBeenCalled();
    expect(mockGameService.exit).not.toHaveBeenCalled();
    expect(mockGameService.initGame).not.toHaveBeenCalled();
  });
});
