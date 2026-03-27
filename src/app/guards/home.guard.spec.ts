import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, RouterModule } from '@angular/router';
import { homeGuard } from './home.guard';
import { GAME_STORE_TOKEN } from '@hunt-the-bishomalo/core/api';
import { GAME_ENGINE_TOKEN } from '@hunt-the-bishomalo/game/api';
import { RouteTypes } from '@hunt-the-bishomalo/shared-data';

describe('homeGuard (Jest)', () => {
  let mockRouter: jest.Mocked<Router>;
  let mockGameStore: any;
  let mockGameEngine: any;

  const executeGuard: CanActivateFn = (...params) =>
    TestBed.runInInjectionContext(() => homeGuard(...params));

  beforeEach(() => {
    mockRouter = {
      navigateByUrl: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    mockGameStore = {
      settings: jest.fn().mockReturnValue({}),
      board: jest.fn().mockReturnValue([]),
    };

    mockGameEngine = {
      initGame: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: GAME_STORE_TOKEN, useValue: mockGameStore },
        { provide: GAME_ENGINE_TOKEN, useValue: mockGameEngine },
      ],
    });
  });

  const mockRoute: any = {};
  const mockState: any = { url: '/home' };

  it('should allow activation and initialize game when settings exist and board is empty', () => {
    mockGameStore.settings.mockReturnValue({ difficulty: 'easy', size: 2 });
    mockGameStore.board.mockReturnValue([]);

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBe(true);
    expect(mockGameStore.settings).toHaveBeenCalled();
    expect(mockGameEngine.initGame).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should allow activation but NOT initialize game when settings exist and board is NOT empty', () => {
    mockGameStore.settings.mockReturnValue({ difficulty: 'easy', size: 2 });
    mockGameStore.board.mockReturnValue([[{ x: 0, y: 0, content: [] }]]);

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBe(true);
    expect(mockGameStore.settings).toHaveBeenCalled();
    expect(mockGameEngine.initGame).not.toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should deny activation and redirect to /settings if settings are missing', () => {
    mockGameStore.settings.mockReturnValue({});

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBe(false);
    expect(mockGameStore.settings).toHaveBeenCalled();
    expect(mockGameEngine.initGame).not.toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(RouteTypes.SETTINGS);
  });
});
