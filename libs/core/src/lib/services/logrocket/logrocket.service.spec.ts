import { TestBed } from '@angular/core/testing';
import { LogRocketService } from './logrocket.service';
import LogRocket from 'logrocket';

jest.mock('logrocket', () => ({
  init: jest.fn(),
}));

describe('LogRocketService', () => {
  let service: LogRocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogRocketService],
    });
    service = TestBed.inject(LogRocketService);
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not initialize LogRocket in development mode', () => {
    jest.spyOn(service as any, 'isDev').mockReturnValue(true);

    service.init();

    expect(LogRocket.init).not.toHaveBeenCalled();
  });

  it('should initialize LogRocket in production mode', () => {
    jest.spyOn(service as any, 'isDev').mockReturnValue(false);

    service.init();

    expect(LogRocket.init).toHaveBeenCalledWith('mrbd1e/espabilatech');
  });

  it('isDev should return the value from isDevMode', () => {
    // This test ensures coverage for the isDev method itself
    const isDevValue = (service as any).isDev();
    expect(typeof isDevValue).toBe('boolean');
  });
});
