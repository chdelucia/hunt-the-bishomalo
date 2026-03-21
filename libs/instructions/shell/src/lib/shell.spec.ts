import { instructionsRoutes } from './instructions.routes';

describe('instructionsRoutes', () => {
  it('should have a default route', () => {
    expect(instructionsRoutes[0].path).toBe('');
  });

  it('should load InstructionsComponent', async () => {
    const route = instructionsRoutes[0];
    if (route.loadComponent) {
      const component = await (route.loadComponent() as Promise<any>);
      expect(component).toBeTruthy();
    }
  });
});
