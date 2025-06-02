import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, RouterModule } from '@angular/router';
import { homeGuard } from './home.guard';
import { GameStore } from '../store';
import { GameEngineService } from '../services';
import { RouteTypes } from '../models';

const mockGameStore = {
  settings: jest.fn(),
}

const mockGameEngine = {
  initGame: jest.fn(),
}

describe('homeGuard (Jest)', () => {
  let mockRouter: jest.Mocked<Router>;

  const executeGuard: CanActivateFn = (...params) =>
    TestBed.runInInjectionContext(() => homeGuard(...params));

  beforeEach(() => {
    mockRouter = {
      navigateByUrl: jest.fn(),
    } as unknown as jest.Mocked<Router>;
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: GameStore, useValue: mockGameStore },
        { provide: GameEngineService, useValue: mockGameEngine },
      ],
    });
  });

  const mockRoute: any = {};
  const mockState: any = { url: '/home' };

  it('should allow activation and initialize game when settings exist', () => {
    mockGameStore.settings.mockReturnValue({ difficulty: 'easy' });

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBe(true);
    expect(mockGameStore.settings).toHaveBeenCalled();
    expect(mockGameEngine.initGame).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should deny activation and redirect to /settings if settings are missing', () => {
    mockGameStore.settings.mockReturnValue(null);

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBe(false);
    expect(mockGameStore.settings).toHaveBeenCalled();
    expect(mockGameEngine.initGame).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(RouteTypes.SETTINGS);
  });
});
