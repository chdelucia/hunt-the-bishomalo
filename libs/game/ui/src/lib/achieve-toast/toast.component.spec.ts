import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { Achievement, ACHIEVEMENT_SERVICE } from '@hunt-the-bishomalo/achievements/api';

const achievementServiceMock = {
  completed: signal(undefined),
};
describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  const fakeAchievement: Achievement = {
    id: '1',
    title: 'Achievement Title',
    description: 'Achievement Description',
    svgIcon: '<svg></svg>',
    unlocked: true,
    rarity: 'common',
  } as Achievement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ToastComponent],
      providers: [{ provide: ACHIEVEMENT_SERVICE, useValue: achievementServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a toast when achievement is completed', () => {
    achievementServiceMock.completed.set(fakeAchievement);

    fixture.detectChanges(); // Dispara el effect

    const toasts = component.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].achievement).toEqual(fakeAchievement);
  });

  it(
    'should remove toast after timeout',
    fakeTimersTest(() => {
      achievementServiceMock.completed.set(fakeAchievement);
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
