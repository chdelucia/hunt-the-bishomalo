import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let routerEvents$: Subject<any>;

  const mockRouter = {
    events: new Subject<any>()
  };

  beforeEach(() => {
    (window as any).gtag = jest.fn();

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
      ],
    });

    service = TestBed.inject(AnalyticsService);
    routerEvents$ = mockRouter.events;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send page_view event on NavigationEnd', () => {
    const navEvent = new NavigationEnd(1, '/start', '/start');
    routerEvents$.next(navEvent);

    expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', expect.objectContaining({
      page_path: '/start',
      page_location: window.location.href,
      page_title: document.title,
    }));
  });

  describe('sendEvent', () => {
    it('should call gtag with event and params', () => {
      service.sendEvent('test_event', { foo: 'bar' });

      expect(window.gtag).toHaveBeenCalledWith('event', 'test_event', { foo: 'bar' });
    });

    it('should call gtag with empty params if none provided', () => {
      service.sendEvent('test_event');

      expect(window.gtag).toHaveBeenCalledWith('event', 'test_event', {});
    });

    it('should not throw if gtag is undefined', () => {
      delete (window as any).gtag;

      expect(() => {
        service.sendEvent('test_event');
      }).not.toThrow();
    });
  });

  describe('trackAchievementUnlocked', () => {
    it('should call sendEvent with achievement data', () => {
      const spy = jest.spyOn(service, 'sendEvent');

      service.trackAchievementUnlocked('achv-123', 'Super Win');

      expect(spy).toHaveBeenCalledWith('achievement_unlocked', expect.objectContaining({
        achievement_id: 'achv-123',
        achievement_name: 'Super Win',
        category: 'achievements',
        debug_mode: expect.any(Boolean),
      }));
    });
  });
});
