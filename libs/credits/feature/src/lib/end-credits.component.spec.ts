import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EndCreditsComponent } from './end-credits.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameSoundService, GAME_ENGINE_TOKEN } from '@hunt-the-bishomalo/core/services';
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
});
