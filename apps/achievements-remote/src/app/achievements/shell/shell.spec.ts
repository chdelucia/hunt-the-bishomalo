import { achievementsRoutes } from './achievements.routes';

describe('achievementsRoutes', () => {
  it('should load components', async () => {
    for (const route of achievementsRoutes) {
      if (route.loadComponent) {
        const component = await (route.loadComponent() as any);
        expect(component).toBeTruthy();
      }
    }
  });
});
