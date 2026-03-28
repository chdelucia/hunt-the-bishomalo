import { TestBed } from '@angular/core/testing';
import { IdlePreloadingStrategy } from './preloading-strategy';
import { Route } from '@angular/router';
import { of } from 'rxjs';

describe('IdlePreloadingStrategy', () => {
  let strategy: IdlePreloadingStrategy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IdlePreloadingStrategy],
    });
    strategy = TestBed.inject(IdlePreloadingStrategy);
  });

  it('should be created', () => {
    expect(strategy).toBeTruthy();
  });

  it('should preload after 3 seconds if data.preload is true', () => {
    jest.useFakeTimers();
    const route: Route = { path: 'test', data: { preload: true } };
    const load = jest.fn(() => of(true));
    let result: unknown;

    strategy.preload(route, load).subscribe((res) => (result = res));

    expect(load).not.toHaveBeenCalled();
    jest.advanceTimersByTime(3000);
    expect(load).toHaveBeenCalled();
    expect(result).toBe(true);
    jest.useRealTimers();
  });

  it('should not preload if data.preload is not true', () => {
    jest.useFakeTimers();
    const route: Route = { path: 'test' };
    const load = jest.fn(() => of(true));
    let result: unknown;

    strategy.preload(route, load).subscribe((res) => (result = res));

    jest.advanceTimersByTime(3000);
    expect(load).not.toHaveBeenCalled();
    expect(result).toBe(null);
    jest.useRealTimers();
  });
});
