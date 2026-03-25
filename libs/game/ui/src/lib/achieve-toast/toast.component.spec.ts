import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { CommonModule } from '@angular/common';
import { Achievement } from '@hunt-the-bishomalo/shared-data';

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
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a toast when achievement input is set', () => {
    fixture.componentRef.setInput('achievement', fakeAchievement);
    fixture.detectChanges(); // Trigger the effect

    const toasts = component.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].achievement).toEqual(fakeAchievement);
  });

  it('should render the correct icon path in the image', () => {
    fixture.componentRef.setInput('achievement', {
      ...fakeAchievement,
      svgIcon: 'test-icon.svg',
    });
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toContain('achievements/test-icon.svg');
  });

  it('should handle broken images gracefully', () => {
    fixture.componentRef.setInput('achievement', {
      ...fakeAchievement,
      svgIcon: 'invalid.svg',
    });
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img).toBeTruthy();

    // Simulate error event
    component.onImageError(component.toasts()[0].id);
    fixture.detectChanges();

    expect(img.classList.contains('broken-image')).toBe(true);
  });

  it(
    'should remove toast after timeout',
    fakeTimersTest(() => {
      fixture.componentRef.setInput('achievement', fakeAchievement);
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
