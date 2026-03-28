import { TestBed } from '@angular/core/testing';
import { IdlePreloadingStrategy } from './preloading-strategy';
import { Route } from '@angular/router';
import { of } from 'rxjs';

describe('IdlePreloadingStrategy', () => {
  let strategy: IdlePreloadingStrategy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IdlePreloadingStrategy]
    });
    strategy = TestBed.inject(IdlePreloadingStrategy);
  });

  it('should be created', () => {
    expect(strategy).toBeTruthy();
  });

  it('should preload after 2 seconds', () => {
    jest.useFakeTimers();
    const route: Route = { path: 'test' };
    const load = jest.fn(() => of(true));
    let result: any;

    strategy.preload(route, load).subscribe(res => result = res);

    expect(load).not.toHaveBeenCalled();
    jest.advanceTimersByTime(2000);
    expect(load).toHaveBeenCalled();
    expect(result).toBe(true);
    jest.useRealTimers();
  });
});
