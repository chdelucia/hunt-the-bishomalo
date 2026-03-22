import { creditsRoutes } from './credits.routes';

describe('creditsRoutes', () => {
  it('should load components', async () => {
    for (const route of creditsRoutes) {
      if (route.loadComponent) {
        const component = await (route.loadComponent() as any);
        expect(component).toBeTruthy();
      }
    }
  });
});
