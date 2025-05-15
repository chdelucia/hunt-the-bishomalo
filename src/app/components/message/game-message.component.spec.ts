import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameMessageComponent } from './game-message.component';
import { GameEngineService } from 'src/app/services';

  const gameEngineMock = {
    initGame: jest.fn(),
    newGame: jest.fn(),
  }

describe('GameMessageComponent', () => {
  let component: GameMessageComponent;
  let fixture: ComponentFixture<GameMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameMessageComponent],
      providers: [{ provide: GameEngineService, useValue: gameEngineMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(GameMessageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('message', 'algo');
    fixture.componentRef.setInput('isAlive', true);
    fixture.componentRef.setInput('hasWon', false);
    fixture.componentRef.setInput('settings', {size: 4, pits:1, arrows: 1});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

    it('should call initGame to restar the game', () => {
    component.restartGame()
    expect(gameEngineMock.initGame).toHaveBeenCalled();
  });

  describe('calculatePits', () => {
    it('should return at least 1 pit for small boards', () => {
      const pits = (component as any).calculatePits(2);
      expect(pits).toBe(1);
    });

    it('should return 10% of total cells rounded down', () => {
      const pits = (component as any).calculatePits(5);
      expect(pits).toBe(2);
    });
  });

  describe('nextLevel', () => {
    it('should increase board size and recalculate pits', () => {
      component.nextLevel();

      expect(gameEngineMock.initGame).toHaveBeenCalledWith(
        expect.objectContaining({
          size: 5,
          pits: 2
        })
      );
    });
  });

  describe('restartGame', () => {
    it('should call initGame without arguments', () => {
      component.restartGame();
      expect(gameEngineMock.initGame).toHaveBeenCalledWith();
    });
  });


});
