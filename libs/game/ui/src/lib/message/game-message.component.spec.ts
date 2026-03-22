import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameMessageComponent } from './game-message.component';
import { Router } from '@angular/router';
import { RouteTypes } from '@hunt-the-bishomalo/shared-data';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';

const routerMock = {
  navigate: jest.fn(),
};

describe('GameMessageComponent', () => {
  let component: GameMessageComponent;
  let fixture: ComponentFixture<GameMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameMessageComponent, getTranslocoTestingModule()],
      providers: [
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameMessageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('message', 'algo');
    fixture.componentRef.setInput('isAlive', true);
    fixture.componentRef.setInput('hasWon', false);
    fixture.componentRef.setInput('size', 4);
    fixture.componentRef.setInput('maxLevels', 10);
    fixture.componentRef.setInput('lives', 8);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit restartRequested to restart the game', () => {
    const spy = jest.spyOn(component.restartRequested, 'emit');
    component.restartGame();
    expect(spy).toHaveBeenCalled();
  });

  it('should display message when present', () => {
    fixture.componentRef.setInput('message', '¡Has ganado!');
    fixture.componentRef.setInput('size', 5);

    fixture.detectChanges();

    const messageEl = fixture.nativeElement.querySelector('p');
    expect(messageEl?.textContent).toContain('¡Has ganado!');
  });

  it('should show retry button when player is dead', () => {
    fixture.componentRef.setInput('isAlive', false);
    fixture.componentRef.setInput('size', 5);

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.newgame');
    expect(button?.textContent).toContain('message.tryAgainButton');
  });

  it('should call restartGame when retry button is clicked', () => {
    const spy = jest.spyOn(component.restartRequested, 'emit');
    fixture.componentRef.setInput('isAlive', false);
    fixture.componentRef.setInput('size', 5);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.newgame');
    button.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should show next level button when player has won', () => {
    fixture.componentRef.setInput('hasWon', true);
    fixture.componentRef.setInput('size', 6); // size < 20

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.newgame');
    expect(button?.textContent).toContain('message.congratsNextLevelButton');
  });

  it('should show final message when level 20 is reached', () => {
    fixture.componentRef.setInput('hasWon', true);
    fixture.componentRef.setInput('size', 18);

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.newgame');
    expect(button?.textContent).toContain('message.congratsBossButton');
  });

  it('should navigate to next level', () => {
    component.nextLevel();
    expect(routerMock.navigate).toHaveBeenCalledWith([RouteTypes.SHOP], {
      state: {
        fromSecretPath: true,
      },
    });
  });

  it('should navigate to results on new game btn click', () => {
    component.newGame();
    expect(routerMock.navigate).toHaveBeenCalledWith([RouteTypes.RESULTS], {
      state: {
        fromSecretPath: true,
      },
    });
  });

  it('should navigate to boss on complete the game', () => {
    component.goToBoss();
    expect(routerMock.navigate).toHaveBeenCalledWith([RouteTypes.BOSS], {
      state: {
        fromSecretPath: true,
      },
    });
  });
});
