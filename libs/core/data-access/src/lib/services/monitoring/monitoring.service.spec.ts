import { TestBed } from '@angular/core/testing';
import { MonitoringService } from './monitoring.service';
import { LogRocketService } from './logrocket.service';
import { SentryService } from './sentry.service';

describe('MonitoringService', () => {
  let service: MonitoringService;
  let logRocketService: jest.Mocked<LogRocketService>;
  let sentryService: jest.Mocked<SentryService>;

  beforeEach(() => {
    const logRocketMock = {
      init: jest.fn(),
      getSessionURL: jest.fn(),
    };
    const sentryMock = {
      setTag: jest.fn(),
      captureException: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        MonitoringService,
        { provide: LogRocketService, useValue: logRocketMock },
        { provide: SentryService, useValue: sentryMock },
      ],
    });

    service = TestBed.inject(MonitoringService);
    logRocketService = TestBed.inject(LogRocketService) as jest.Mocked<LogRocketService>;
    sentryService = TestBed.inject(SentryService) as jest.Mocked<SentryService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize LogRocket and integrate with Sentry', () => {
    const sessionURL = 'https://logrocket.com/session/123';
    logRocketService.getSessionURL.mockImplementation((callback) => callback(sessionURL));

    service.init();

    expect(logRocketService.init).toHaveBeenCalled();
    expect(logRocketService.getSessionURL).toHaveBeenCalled();
    expect(sentryService.setTag).toHaveBeenCalledWith('logrocket_session_url', sessionURL);
  });

  it('should not call setTag if LogRocket session URL is not available', () => {
    logRocketService.getSessionURL.mockImplementation(() => {
      // No-op for testing
    });

    service.init();

    expect(sentryService.setTag).not.toHaveBeenCalled();
  });
});
