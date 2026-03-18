import { isDevMode, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { RouteTypes } from '@hunt-the-bishomalo/data';
import { secretGuard } from './secret.guard';

jest.mock('@angular/core', () => ({
  ...jest.requireActual('@angular/core'),
  isDevMode: jest.fn(),
}));

describe('secretGuard (Jest)', () => {
  let mockRouter: any;
  const mockIsDevMode = isDevMode as jest.Mock;
  const currentNavigationSignal = signal<any>(null);

  const executeGuard = (...params: Parameters<CanActivateFn>) =>
    TestBed.runInInjectionContext(() => secretGuard(...params));

  beforeEach(() => {
    mockRouter = {
      navigateByUrl: jest.fn(),
      currentNavigation: currentNavigationSignal,
    };

    mockIsDevMode.mockReturnValue(false);
    currentNavigationSignal.set(null);

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: mockRouter }],
    });
  });

  const mockRoute: any = {};
  const mockState: any = { url: '/secret' }; // Simula un RouterStateSnapshot

  it('should allow activation when in dev mode', () => {
    mockIsDevMode.mockReturnValue(true);

    const result = executeGuard(mockRoute, mockState);
    expect(result).toBe(true);
    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should allow activation when fromSecretPath is true in navigation extras', () => {
    currentNavigationSignal.set({
      extras: { state: { fromSecretPath: true } },
    });

    const result = executeGuard(mockRoute, mockState);
    expect(result).toBe(true);
  });

  it('should deny activation and redirect to /home if fromSecretPath is false', () => {
    currentNavigationSignal.set({
      extras: { state: { fromSecretPath: false } },
    });

    const result = executeGuard(mockRoute, mockState);
    expect(result).toBe(false);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(RouteTypes.HOME);
  });

  it('should deny activation and redirect to /home if navigation is undefined', () => {
    currentNavigationSignal.set(null);

    const result = executeGuard(mockRoute, mockState);
    expect(result).toBe(false);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(RouteTypes.HOME);
  });
});
