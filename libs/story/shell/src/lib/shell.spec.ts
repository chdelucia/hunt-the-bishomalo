import { storyRoutes } from './story.routes';

describe('storyRoutes', () => {
  it('should load components', async () => {
    for (const route of storyRoutes) {
      if (route.loadComponent) {
        const component = await (route.loadComponent() as any);
        expect(component).toBeTruthy();
      }
    }
  });
});
