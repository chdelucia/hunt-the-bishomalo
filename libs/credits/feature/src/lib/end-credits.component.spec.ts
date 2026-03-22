import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EndCreditsComponent } from './end-credits.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameSoundService } from '@hunt-the-bishomalo/core/services';
import { GAME_ENGINE_TOKEN } from '@hunt-the-bishomalo/game/api';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';

const mockGameEngineService = {
  newGame: jest.fn(),
};

const mockGameSoundService = {
  stop: jest.fn(),
  playSound: jest.fn(),
};

const mockRouter = {
  navigateByUrl: jest.fn(),
};

describe('EndCreditsComponent', () => {
  let component: EndCreditsComponent;
  let fixture: ComponentFixture<EndCreditsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndCreditsComponent, CommonModule, getTranslocoTestingModule()],
      providers: [
        { provide: GAME_ENGINE_TOKEN, useValue: mockGameEngineService },
        { provide: GameSoundService, useValue: mockGameSoundService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EndCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call gameSound.stop and playSound on init', () => {
    component.ngOnInit();
    expect(mockGameSoundService.stop).toHaveBeenCalled();
    expect(mockGameSoundService.playSound).toHaveBeenCalled();
  });

  it('should call newGame and navigate on newGame', () => {
    component.newGame();
    expect(mockGameEngineService.newGame).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).toHaveBeenCalled();
  });

  it('should update scroll position automatically', () => {
    const initialPos = component.scrollPosition();
    const rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(() => {
      return 1;
    });

    (component as any).lastTime = 100;
    (component as any).startAutoScroll();

    const animate = rafSpy.mock.calls[0][0];
    animate(200);

    expect(component.scrollPosition()).toBeGreaterThan(initialPos);
    rafSpy.mockRestore();
  });

  it('should stop scrolling when reaching MAX_SCROLL_POSITION', () => {
    component.scrollPosition.set(component.MAX_SCROLL_POSITION);
    component.autoScroll.set(true);

    const rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);

    (component as any).lastTime = 100;
    (component as any).startAutoScroll();

    const animate = rafSpy.mock.calls[0][0];
    animate(200);

    expect(component.scrollPosition()).toBe(component.MAX_SCROLL_POSITION);
    expect(component.autoScroll()).toBe(false);
    expect(mockGameSoundService.stop).toHaveBeenCalled();
    rafSpy.mockRestore();
  });

  it('should stop sound on destroy', () => {
    component.ngOnDestroy();
    expect(mockGameSoundService.stop).toHaveBeenCalled();
  });

  it('should navigate to home on backToHome', () => {
    component.backToHome();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('home');
  });

  it('should show backToHome button when lives > 0', () => {
    component.store.$_updateGameStatus({ lives: 1 });
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button')?.textContent).toContain('credits.backToHomeButton');
  });

  it('should show newGame button when lives <= 0', () => {
    component.store.$_updateGameStatus({ lives: 0 });
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button')?.textContent).toContain('credits.newGameButton');
  });
});
