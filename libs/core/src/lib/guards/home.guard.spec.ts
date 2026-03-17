import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { homeGuard } from './home.guard';
import { GameStore } from '../store';
import { GAME_ENGINE_TOKEN } from '@hunt-the-bishomalo/game/api';
import { RouteTypes } from '@hunt-the-bishomalo/data';

const mockGameStore = {
  settings: jest.fn().mockReturnValue({}),
};

const mockGameEngine = {
  initGame: jest.fn(),
};

describe('homeGuard (Jest)', () => {
  let mockRouter: jest.Mocked<Router>;

  const executeGuard: CanActivateFn = (route, state) =>
    TestBed.runInInjectionContext(() => homeGuard(route, state));

  beforeEach(() => {
    mockRouter = {
      navigateByUrl: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: GameStore, useValue: mockGameStore },
        { provide: GAME_ENGINE_TOKEN, useValue: mockGameEngine },
      ],
    });
  });

  const mockRoute: any = {};
  const mockState: any = { url: '/home' };

  it('should allow activation and initialize game when settings exist', () => {
    mockGameStore.settings.mockReturnValue({ difficulty: 'easy', size: 2 });

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBe(true);
    expect(mockGameStore.settings).toHaveBeenCalled();
    expect(mockGameEngine.initGame).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should deny activation and redirect to /settings if settings are missing', () => {
    mockGameStore.settings.mockReturnValue({});

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBe(false);
    expect(mockGameStore.settings).toHaveBeenCalled();
    expect(mockGameEngine.initGame).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(RouteTypes.SETTINGS);
  });
});
