import { TestBed } from '@angular/core/testing';
import { LogRocketService } from './logrocket.service';
import LogRocket from 'logrocket';
import { isDevMode } from '@angular/core';

jest.mock('logrocket', () => ({
  init: jest.fn(),
  getSessionURL: jest.fn(),
}));

jest.mock('@angular/core', () => ({
  ...jest.requireActual('@angular/core'),
  isDevMode: jest.fn(),
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

  it('should not initialize LogRocket in development mode', () => {
    (isDevMode as jest.Mock).mockReturnValue(true);
    service.init();
    expect(LogRocket.init).not.toHaveBeenCalled();
  });

  it('should initialize LogRocket in production mode', () => {
    (isDevMode as jest.Mock).mockReturnValue(false);
    service.init();
    expect(LogRocket.init).toHaveBeenCalledWith('mrbd1e/espabilatech');
  });

  it('should not get session URL in development mode', () => {
    (isDevMode as jest.Mock).mockReturnValue(true);
    const callback = jest.fn();
    service.getSessionURL(callback);
    expect(LogRocket.getSessionURL).not.toHaveBeenCalled();
  });

  it('should get session URL in production mode', () => {
    (isDevMode as jest.Mock).mockReturnValue(false);
    const callback = jest.fn();
    service.getSessionURL(callback);
    expect(LogRocket.getSessionURL).toHaveBeenCalledWith(callback);
  });
});
