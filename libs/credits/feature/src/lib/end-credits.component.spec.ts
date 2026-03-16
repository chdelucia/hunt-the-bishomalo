import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EndCreditsComponent } from './end-credits.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameSoundService } from '@hunt-the-bishomalo/core/services';
import { GameEngineService } from '@hunt-the-bishomalo/game/data-access';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/core/utils';

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
        { provide: GameEngineService, useValue: mockGameEngineService },
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
    const rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: any) => {
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
});
