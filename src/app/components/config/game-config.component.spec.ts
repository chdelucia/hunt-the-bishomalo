import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameConfigComponent } from './game-config.component';
import { GameEngineService } from 'src/app/services';

const gameEngineServiceMock = {
    initGame: jest.fn(),
    syncSettingsWithStorage: jest.fn()
};
describe('GameConfigComponent', () => {
  let component: GameConfigComponent;
  let fixture: ComponentFixture<GameConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameConfigComponent],
      providers: [
        { provide: GameEngineService, useValue: gameEngineServiceMock }
      ]
    }).compileComponents();

    jest.clearAllMocks();
    fixture = TestBed.createComponent(GameConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    const form = component.configForm;
    expect(form.value).toEqual({
      player: 'Player',
      size: 4,
      pits: 2,
      arrows: 1
    });
  });

  it('should mark form as invalid if required fields are empty or invalid', () => {
    component.configForm.patchValue({ player: '', size: 2, pits: 0, arrows: 0 });
    expect(component.configForm.valid).toBe(false);
  });

  it('should call initGame with form values when form is valid', () => {
    component.configForm.setValue({
      player: 'Ana',
      size: 6,
      pits: 2,
      arrows: 3
    });

    component.submitForm();
    expect(gameEngineServiceMock.initGame).toHaveBeenCalledWith({
      player: 'Ana',
      size: 6,
      pits: 2,
      arrows: 3,
      blackout: false
    });
  });

  it('should NOT call initGame when form is invalid', () => {
    component.configForm.setValue({
      player: '',
      size: 3,
      pits: 0,
      arrows: 0
    });

    component.submitForm();
    expect(gameEngineServiceMock.initGame).not.toHaveBeenCalled();
  });
});
