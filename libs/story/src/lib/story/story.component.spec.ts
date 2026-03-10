import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoryComponent } from './story.component';
import { Router } from '@angular/router';
import { GameStoryService } from './game-story.service';
import { RouteTypes } from '@hunt-the-bishomalo/data';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/core/utils';

const mockRouter = {
  navigate: jest.fn(),
};

const mockStory = {
  level: 1,
  title: 'Inicio',
  text: 'Texto de prueba.',
  effect: 'extraLife',
};

const mockGameStoryService = {
  getStory: jest.fn(() => mockStory),
  checkLevelTrigger: jest.fn(),
};

(global as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {
  text: string;
  lang = 'es-ES';
  pitch = 1;
  rate = 1;
  onend?: () => void;
  constructor(text: string) {
    this.text = text;
  }
};

(global as unknown as { speechSynthesis: unknown }).speechSynthesis = {
  speak: jest.fn((utterance) => {
    setTimeout(() => utterance.onend?.(), 0);
  }),
  cancel: jest.fn(),
};

describe('StoryComponent', () => {
  let component: StoryComponent;
  let fixture: ComponentFixture<StoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoryComponent, getTranslocoTestingModule()],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: GameStoryService, useValue: mockGameStoryService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StoryComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with story and call startReading', () => {
    jest.useFakeTimers();
    const spy = jest.spyOn<StoryComponent, 'startReading'>(component, 'startReading' as any);
    fixture.detectChanges();
    expect(component['fullText']).toBe(mockStory.text);
    expect(spy).toHaveBeenCalledWith(mockStory.text);
    jest.useRealTimers();
  });

  it('should navigate to HOME when goToGame is called', () => {
    component.goToGame();
    expect(mockGameStoryService.checkLevelTrigger).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith([RouteTypes.HOME]);
  });

  it('should format effect correctly', () => {
    expect(component.formatEffect('extraLife')).toBe('extraLife');
    expect(component.formatEffect('unknownEffect')).toBe('unknownEffect');
  });

  it('should show text gradually and activate showExtraInfo at end of audio', () => {
    jest.useFakeTimers();
    const speakMock = jest.fn((utterance) => {
      if (utterance.text.includes('Capítulo')) {
        setTimeout(() => utterance.onend?.(), 10);
      } else if (utterance.text.includes(mockStory.title)) {
        setTimeout(() => utterance.onend?.(), 20);
      } else {
        setTimeout(() => utterance.onend?.(), 30);
      }
    });

    global.speechSynthesis = {
      speak: speakMock,
      cancel: jest.fn(),
    } as unknown as SpeechSynthesis;

    component['startReading'](mockStory.text);
    // Move past interval calls
    for (let i = 0; i < mockStory.text.length; i++) {
      jest.advanceTimersByTime(90);
    }

    expect(component.displayedText()).toBe('Texto de prueba.');
    expect(component.reading()).toBe(false);

    jest.runAllTimers();
    expect(component.showExtraInfo()).toBe(true);
    jest.useRealTimers();
  });
});
