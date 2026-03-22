import { charsRoutes } from './chars.routes';

describe('charsRoutes', () => {
  it('should load components', async () => {
    for (const route of charsRoutes) {
      if (route.loadComponent) {
        const component = await (route.loadComponent() as any);
        expect(component).toBeTruthy();
      }
    }
  });
});
