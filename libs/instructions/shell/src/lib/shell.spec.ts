import { instructionsRoutes } from './instructions.routes';

describe('instructionsRoutes', () => {
  it('should have a default route', () => {
    expect(instructionsRoutes[0].path).toBe('');
  });
});
