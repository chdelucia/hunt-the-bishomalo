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

(global as any).SpeechSynthesisUtterance = class {
  text: string;
  lang = 'es-ES';
  pitch = 1;
  rate = 1;
  onend?: () => void;
  constructor(text: string) {
    this.text = text;
  }
};

(global as any).speechSynthesis = {
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
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with story and call startReading on init', () => {
    fixture.detectChanges();
    expect(component['fullText']).toBe(mockStory.text);
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
    } as any;

    fixture.detectChanges(); // Triggers ngOnInit -> startReading

    // Manual advance to handle the 90ms interval precisely
    for (let i = 0; i < mockStory.text.length; i++) {
      jest.advanceTimersByTime(90);
    }
    // Also run pending for the speech synthesis timeouts
    jest.runOnlyPendingTimers();

    expect(component.displayedText()).toBe(mockStory.text);
    expect(component.reading()).toBe(false);
    expect(component.showExtraInfo()).toBe(true);
  });
});
