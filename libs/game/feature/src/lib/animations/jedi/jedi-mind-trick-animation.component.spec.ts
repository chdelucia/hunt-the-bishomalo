import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JediMindTrickAnimationComponent } from './jedi-mind-trick-animation.component';
import { RouterModule } from '@angular/router';
<<<<<<< HEAD:src/app/components/animations/jedi/jedi-mind-trick-animation.component.spec.ts
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/core/utils';
import { ACHIEVEMENT_SERVICE, AchieveTypes } from '@hunt-the-bishomalo/achievements/api';
=======
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/core';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';
>>>>>>> df75268 (chore: temporary commit to allow merge):libs/game/feature/src/lib/animations/jedi/jedi-mind-trick-animation.component.spec.ts

describe('JediMindTrickAnimationComponent', () => {
  let component: JediMindTrickAnimationComponent;
  let fixture: ComponentFixture<JediMindTrickAnimationComponent>;

  const mockAchievementService = {
    activeAchievement: jest.fn(),
  };

  // Mock AudioContext and SpeechSynthesis
  const mockAudioContext = {
    createOscillator: jest.fn().mockReturnValue({
      type: '',
      frequency: { value: 0 },
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
    }),
    createGain: jest.fn().mockReturnValue({
      gain: {
        value: 0,
        setValueAtTime: jest.fn(),
        linearRampToValueAtTime: jest.fn(),
      },
      connect: jest.fn(),
    }),
    destination: {},
    currentTime: 0,
    state: 'running',
    close: jest.fn().mockResolvedValue(undefined),
  };

  const mockSpeechSynthesis = {
    speak: jest.fn(),
    cancel: jest.fn(),
  };

  beforeEach(async () => {
    (window as any).AudioContext = jest.fn().mockImplementation(() => mockAudioContext);
    (window as any).speechSynthesis = mockSpeechSynthesis;
    (window as any).SpeechSynthesisUtterance = jest.fn();
    jest.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [
        JediMindTrickAnimationComponent,
        RouterModule.forRoot([]),
        getTranslocoTestingModule(),
      ],
      providers: [{ provide: ACHIEVEMENT_SERVICE, useValue: mockAchievementService }],
    }).compileComponents();

    fixture = TestBed.createComponent(JediMindTrickAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should progress through steps on init', () => {
    expect(component.step()).toBe(1);

    jest.advanceTimersByTime(500);
    expect(component.step()).toBe(2);

    jest.advanceTimersByTime(500);
    expect(component.step()).toBe(3);
    expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    expect(component.forceWaves().length).toBe(1);

    jest.advanceTimersByTime(500);
    expect(component.step()).toBe(4);
    expect(component.forceWaves().length).toBe(2);

    jest.advanceTimersByTime(500);
    expect(component.step()).toBe(5);
    expect(component.forceWaves().length).toBe(3);

    jest.advanceTimersByTime(500);
    expect(component.step()).toBe(6);

    jest.advanceTimersByTime(2000); // Wait for waves to be removed
    expect(component.forceWaves().length).toBe(0);
  });

  it('should cleanup on destroy and call achievement service', () => {
    component.ngOnDestroy();
    expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
    expect(mockAchievementService.activeAchievement).toHaveBeenCalledWith(AchieveTypes.JEDI);
  });

  it('should play force sound and speak whispers', () => {
    component.playForceSound();
    expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(2);
    expect(mockAudioContext.createGain).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(1000);
    expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    jest.advanceTimersByTime(300);
    expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(2);
    jest.advanceTimersByTime(300);
    expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(3);
  });
});
