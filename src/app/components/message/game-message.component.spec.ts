import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameMessageComponent } from './game-message.component';
import { GameEngineService } from 'src/app/services';

const gameEngineMock = {
  initGame: jest.fn(),
  newGame: jest.fn(),
  nextLevel: jest.fn(),
};

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
    fixture.componentRef.setInput('settings', { size: 4, pits: 1, arrows: 1 });
    fixture.componentRef.setInput('lives', 8);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call initGame to restar the game', () => {
    component.restartGame();
    expect(gameEngineMock.initGame).toHaveBeenCalled();
  });

  describe('restartGame', () => {
    it('should call initGame without arguments', () => {
      component.restartGame();
      expect(gameEngineMock.initGame).toHaveBeenCalledWith();
    });
  });

  it('should display message when present', () => {
    fixture.componentRef.setInput('message', '¡Has ganado!');
    fixture.componentRef.setInput('settings', { size: 5, pits: 1, wumpus: 1 });

    fixture.detectChanges();

    const messageEl = fixture.nativeElement.querySelector('p');
    expect(messageEl?.textContent).toContain('¡Has ganado!');
  });

  it('should show default message when no message is provided', () => {
    fixture.componentRef.setInput('message', '');
    fixture.componentRef.setInput('settings', { size: 5, pits: 1, wumpus: 1 });

    fixture.detectChanges();

    const messageEl = fixture.nativeElement.querySelector('p');
    expect(messageEl?.textContent).toContain('Activa el sonido');
  });

  it('should show retry button when player is dead', () => {
    fixture.componentRef.setInput('isAlive', false);
    fixture.componentRef.setInput('settings', { size: 5, pits: 1, wumpus: 1 });

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.newgame');
    expect(button?.textContent).toContain('intertarlo de nuevo');
  });

  it('should call restartGame when retry button is clicked', () => {
    fixture.componentRef.setInput('isAlive', false);
    fixture.componentRef.setInput('settings', { size: 5, pits: 1, wumpus: 1 });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.newgame');
    button.click();

    expect(gameEngineMock.initGame).toHaveBeenCalled();
  });

  it('should show next level button when player has won', () => {
    fixture.componentRef.setInput('hasWon', true);
    fixture.componentRef.setInput('settings', { size: 6, pits: 1, wumpus: 1 }); // size < 20

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.newgame');
    expect(button?.textContent).toContain('Felicidades click');
  });

  it('should show final message when level 20 is reached', () => {
    fixture.componentRef.setInput('hasWon', true);
    fixture.componentRef.setInput('settings', { size: 20, pits: 1, wumpus: 1 });

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.newgame');
    expect(button?.textContent).toContain('completado todos los niveles');
  });

  it('should call new Game', () => {
    component.newGame();
    expect(gameEngineMock.newGame).toHaveBeenCalled();
  });
});
