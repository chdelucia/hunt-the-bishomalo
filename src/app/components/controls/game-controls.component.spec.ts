import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameControlsComponent } from './game-controls.component';
import { GameEngineService } from 'src/app/services';
import { getTranslocoTestingModule } from 'src/app/utils';

const mockGameService = {
  moveForward: jest.fn(),
  turnLeft: jest.fn(),
  turnRight: jest.fn(),
  shootArrow: jest.fn(),
  exit: jest.fn(),
  initGame: jest.fn(),
  newGame: jest.fn(),
};

describe('GameControlsComponent', () => {
  let component: GameControlsComponent;
  let fixture: ComponentFixture<GameControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameControlsComponent, getTranslocoTestingModule()],
      providers: [{ provide: GameEngineService, useValue: mockGameService }],
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

  it('should call shootArrow() on space key', () => {
    const event = new KeyboardEvent('keydown', { code: 'Space' });
    window.dispatchEvent(event);
    expect(mockGameService.shootArrow).toHaveBeenCalled();
  });

  it('should call moveforaw() on W key', () => {
    const event = new KeyboardEvent('keydown', { code: 'KeyW' });
    window.dispatchEvent(event);
    expect(mockGameService.moveForward).toHaveBeenCalled();
  });
  it('should call tur left() on A key', () => {
    const event = new KeyboardEvent('keydown', { code: 'KeyA' });
    window.dispatchEvent(event);
    expect(mockGameService.turnLeft).toHaveBeenCalled();
  });

  it('should call tur right() on D key', () => {
    const event = new KeyboardEvent('keydown', { code: 'KeyD' });
    window.dispatchEvent(event);
    expect(mockGameService.turnRight).toHaveBeenCalled();
  });

  it('should call tur right() on R key', () => {
    const event = new KeyboardEvent('keydown', { code: 'KeyR' });
    window.dispatchEvent(event);
    expect(mockGameService.initGame).toHaveBeenCalled();
  });

  it('should call new game on N key', () => {
    const event = new KeyboardEvent('keydown', { code: 'KeyN' });
    window.dispatchEvent(event);
    expect(mockGameService.newGame).toHaveBeenCalled();
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

  it('should reset same level', () => {
    component.resetGame();
    expect(mockGameService.initGame).toHaveBeenCalled();
  });
});
