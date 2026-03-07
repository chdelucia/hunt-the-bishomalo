import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, RouterModule } from '@angular/router';
import { secretGuard } from './secret.guard';

describe('secretGuard (Jest)', () => {
  let mockRouter: jest.Mocked<Router>;

  const executeGuard: CanActivateFn = (...params) =>
    TestBed.runInInjectionContext(() => secretGuard(...params));

  beforeEach(() => {
    mockRouter = {
      navigateByUrl: jest.fn(),
      getCurrentNavigation: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      providers: [{ provide: Router, useValue: mockRouter }],
    });
  });

  const mockRoute: any = {};
  const mockState: any = { url: '/secret' }; // Simula un RouterStateSnapshot

  it('should allow activation when fromSecretPath is true in navigation extras', () => {
    mockRouter.getCurrentNavigation.mockReturnValue({
      extras: { state: { fromSecretPath: true } },
    } as any);

    const result = executeGuard(mockRoute, mockState);
    expect(result).toBe(true);
  });

  it('should deny activation and redirect to /home if fromSecretPath is false', () => {
    mockRouter.getCurrentNavigation.mockReturnValue({
      extras: { state: { fromSecretPath: false } },
    } as any);

    const result = executeGuard(mockRoute, mockState);
    expect(result).toBe(false);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('home');
  });

  it('should deny activation and redirect to /home if navigation is undefined', () => {
    mockRouter.getCurrentNavigation.mockReturnValue(null);

    const result = executeGuard(mockRoute, mockState);
    expect(result).toBe(false);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('home');
  });
});
