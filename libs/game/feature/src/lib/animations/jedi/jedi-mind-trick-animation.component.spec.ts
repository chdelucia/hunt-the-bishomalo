import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JediMindTrickAnimationComponent } from './jedi-mind-trick-animation.component';
import { RouterModule } from '@angular/router';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/shared-util';
import { AchieveTypes } from '@hunt-the-bishomalo/shared-data';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';

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
    (globalThis as any).AudioContext = jest.fn().mockImplementation(() => mockAudioContext);
    (globalThis as any).speechSynthesis = mockSpeechSynthesis;
    (globalThis as any).SpeechSynthesisUtterance = jest.fn();
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

  it('should be at terminal step on init', () => {
    expect(component.step()).toBe(6);
  });

  it('should cleanup on destroy and call achievement service', () => {
    fixture.destroy();
    expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
    expect(mockAchievementService.activeAchievement).toHaveBeenCalledWith(AchieveTypes.JEDI);
  });

  it('should play force sound', () => {
    component.playForceSound();
    expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(2);
    expect(mockAudioContext.createGain).toHaveBeenCalledTimes(2);
  });

  it('should handle onDestroy when audioContext is null', () => {
    (component as any).audioContext = null;
    mockAudioContext.close.mockClear();
    fixture.destroy();
    expect(mockAudioContext.close).not.toHaveBeenCalled();
    expect(mockAchievementService.activeAchievement).toHaveBeenCalled();
  });

  it('should handle onDestroy when audioContext is closed', () => {
    const closedAudioContext = { ...mockAudioContext, state: 'closed', close: jest.fn() };
    (component as any).audioContext = closedAudioContext;
    fixture.destroy();
    expect(closedAudioContext.close).not.toHaveBeenCalled();
  });

  it('should handle onDestroy when speechSynthesis is missing', () => {
    const originalSpeechSynthesis = globalThis.speechSynthesis;
    (globalThis as any).speechSynthesis = undefined;
    fixture.destroy();
    expect(mockAchievementService.activeAchievement).toHaveBeenCalled();
    (globalThis as any).speechSynthesis = originalSpeechSynthesis;
  });

  it('should use webkitAudioContext as fallback', () => {
    const originalAudioContext = (globalThis as any).AudioContext;
    const originalWebkitAudioContext = (globalThis as any).webkitAudioContext;
    (globalThis as any).AudioContext = undefined;
    (globalThis as any).webkitAudioContext = jest.fn().mockImplementation(() => mockAudioContext);

    component.playForceSound();

    expect((globalThis as any).webkitAudioContext).toHaveBeenCalled();
    expect(mockAudioContext.createOscillator).toHaveBeenCalled();

    (globalThis as any).webkitAudioContext = originalWebkitAudioContext;
    (globalThis as any).AudioContext = originalAudioContext;
  });

  it('should return early in playForceSound if no AudioContext is available', () => {
    const originalAudioContext = (globalThis as any).AudioContext;
    (globalThis as any).AudioContext = undefined;
    (globalThis as any).webkitAudioContext = undefined;

    component.playForceSound();

    expect(mockAudioContext.createOscillator).not.toHaveBeenCalled();

    (globalThis as any).AudioContext = originalAudioContext;
  });
});
