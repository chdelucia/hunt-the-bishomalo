import { gameRoutes } from './game.routes';

describe('gameRoutes', () => {
  it('should have correct paths', () => {
    expect(gameRoutes[0].path).toBe('');
    expect(gameRoutes[1].path).toBe('secret');
  });

  it('should load components', async () => {
    for (const route of gameRoutes) {
      if (route.loadComponent) {
        const component = await (route.loadComponent() as any);
        expect(component).toBeTruthy();
      }
    }
  });
});
