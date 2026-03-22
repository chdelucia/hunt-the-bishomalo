import { bossRoutes } from './boss.routes';

describe('bossRoutes', () => {
  it('should have a default route', () => {
    expect(bossRoutes[0].path).toBe('');
  });

  it('should load BossFightComponent', async () => {
    const route = bossRoutes[0];
    if (route.loadComponent) {
      const component = await (route.loadComponent() as Promise<any>);
      expect(component).toBeTruthy();
    }
  });
});
