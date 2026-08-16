import { appRoutes } from './app.routes';
import { loadRemoteModule } from '@angular-architects/native-federation';

jest.mock('@angular-architects/native-federation', () => ({
  loadRemoteModule: jest.fn((remoteName: string) => {
    if (remoteName === 'achievements') {
      return Promise.resolve({ achievementsRoutes: [] });
    }
    return Promise.reject('unknown remote');
  }),
}));

describe('appRoutes', () => {
  it('should call loadRemoteModule for achievements route', async () => {
    const route = appRoutes.find((r) => r.path === 'logros');
    expect(route).toBeDefined();
    if (route?.loadChildren) {
      await (route.loadChildren() as any);
      expect(loadRemoteModule).toHaveBeenCalledWith('achievements', './Routes');
    }
  });

  it('should fallback gracefully if remote loading fails', async () => {
    (loadRemoteModule as jest.Mock).mockRejectedValueOnce(new Error('Network offline'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const route = appRoutes.find((r) => r.path === 'logros');
    expect(route).toBeDefined();
    if (route?.loadChildren) {
      const fallbackRoutes = await (route.loadChildren() as any);
      expect(fallbackRoutes).toBeDefined();
      expect(Array.isArray(fallbackRoutes)).toBe(true);
      expect(consoleSpy).toHaveBeenCalled();
    }
  });

  it('should have the expected number of routes', () => {
    expect(appRoutes.length).toBeGreaterThan(0);
  });

  it('should have lazy loaded routes', async () => {
    for (const route of appRoutes) {
      if (route.loadChildren) {
        const children = await (route.loadChildren() as any);
        expect(children).toBeTruthy();
      }
      if (route.loadComponent) {
        const component = await (route.loadComponent() as any);
        expect(component).toBeTruthy();
      }
    }
  });
});
