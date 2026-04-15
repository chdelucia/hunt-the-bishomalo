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

  it('should preload immediately if data.preload is true', () => {
    const route: Route = { path: 'test', data: { preload: true } };
    const load = jest.fn(() => of(true));
    let result: unknown;

    strategy.preload(route, load).subscribe((res) => (result = res));

    expect(load).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should not preload if data.preload is not true', () => {
    const route: Route = { path: 'test' };
    const load = jest.fn(() => of(true));
    let result: unknown;

    strategy.preload(route, load).subscribe((res) => (result = res));

    expect(load).not.toHaveBeenCalled();
    expect(result).toBe(null);
  });
});
