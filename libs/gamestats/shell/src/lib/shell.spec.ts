import { gamestatsRoutes } from './gamestats.routes';

describe('gamestatsRoutes', () => {
  it('should load components', async () => {
    for (const route of gamestatsRoutes) {
      if (route.loadComponent) {
        const component = await (route.loadComponent() as any);
        expect(component).toBeTruthy();
      }
    }
  });
});
