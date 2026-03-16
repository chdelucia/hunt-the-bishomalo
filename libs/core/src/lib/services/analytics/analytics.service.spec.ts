import { TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let routerEvents: Subject<any>;
  let routerMock: any;

  beforeEach(() => {
    routerEvents = new Subject<any>();
    routerMock = {
      events: routerEvents.asObservable(),
    };

    (globalThis as any).gtag = jest.fn();

    TestBed.configureTestingModule({
      providers: [
        AnalyticsService,
        { provide: Router, useValue: routerMock },
      ],
    });

    service = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should track page views on NavigationEnd', () => {
    const event = new NavigationEnd(1, '/test', '/test');
    routerEvents.next(event);

    expect(globalThis.gtag).toHaveBeenCalledWith('event', 'page_view', expect.objectContaining({
      page_path: '/test',
    }));
  });

  it('should send custom event', () => {
    service.sendEvent('custom_event', { foo: 'bar' });
    expect(globalThis.gtag).toHaveBeenCalledWith('event', 'custom_event', { foo: 'bar' });
  });

  it('should track achievement unlocked', () => {
    service.trackAchievementUnlocked('ach_1', 'First Achievement');
    expect(globalThis.gtag).toHaveBeenCalledWith('event', 'achievement_unlocked', expect.objectContaining({
      achievement_id: 'ach_1',
      achievement_name: 'First Achievement',
    }));
  });
});
