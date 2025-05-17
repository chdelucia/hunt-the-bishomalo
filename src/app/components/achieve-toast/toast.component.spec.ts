import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { AchievementService } from 'src/app/services/achievement/achievement.service';
import { CommonModule } from '@angular/common';
import { Achievement } from 'src/app/models';

const achievementServiceMock = {
  completed: jest.fn(),
};
describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  const fakeAchievement: Achievement = {
    id: '1',
    title: 'Achievement Title',
    description: 'Achievement Description',
    svgIcon: '<svg></svg>',
  } as Achievement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ToastComponent],
      providers: [{ provide: AchievementService, useValue: achievementServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a toast when achievement is completed', () => {
    (achievementServiceMock.completed as jest.Mock).mockReturnValue(fakeAchievement);

    fixture.detectChanges(); // Dispara el effect

    const toasts = component.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].achievement).toEqual(fakeAchievement);
  });

  it(
    'should remove toast after timeout',
    fakeTimersTest(() => {
      (achievementServiceMock.completed as jest.Mock).mockReturnValue(fakeAchievement);
      fixture.detectChanges();

      expect(component.toasts().length).toBe(1);

      jest.advanceTimersByTime(3000);
      expect(component.toasts().length).toBe(0);
    }),
  );
});

function fakeTimersTest(fn: () => void) {
  return () => {
    jest.useFakeTimers();
    fn();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  };
}
