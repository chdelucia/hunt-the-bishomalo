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
    fixture.componentRef.setInput('settings', {});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

    it('should call initGame to restar the game', () => {
    component.restartGame()
    expect(gameEngineMock.initGame).toHaveBeenCalled();
  });

  it('should call new game to start new config of game', () => {
    component.newGame()
    expect(gameEngineMock.newGame).toHaveBeenCalled();
  });
});
