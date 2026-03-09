import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlackoutComponent } from './blackout.component';
import { getTranslocoTestingModule } from '@hunt-the-bishomalo/core/utils';
import { ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/core/services';

describe('BlackoutComponent', () => {
  let component: BlackoutComponent;
  let fixture: ComponentFixture<BlackoutComponent>;

  const mockAchievementService = {
    activeAchievement: jest.fn(),
  };

  beforeEach(async () => {
    jest
      .spyOn(window.HTMLMediaElement.prototype, 'play')
      .mockImplementation(() => Promise.resolve());

    jest.spyOn(window, 'Audio').mockImplementation(() => {
      return {
        play: jest.fn(() => Promise.resolve()),
        pause: jest.fn(),
        currentTime: 0,
        loop: false,
        volume: 1,
      } as unknown as HTMLAudioElement;
    });
    await TestBed.configureTestingModule({
      imports: [BlackoutComponent, getTranslocoTestingModule()],
      providers: [{ provide: ACHIEVEMENT_SERVICE, useValue: mockAchievementService }],
    }).compileComponents();

    fixture = TestBed.createComponent(BlackoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
