import { configRoutes } from './config.routes';

describe('configRoutes', () => {
  it('should load components', async () => {
    for (const route of configRoutes) {
      if (route.loadComponent) {
        const component = await (route.loadComponent() as any);
        expect(component).toBeTruthy();
      }
    }
  });
});
