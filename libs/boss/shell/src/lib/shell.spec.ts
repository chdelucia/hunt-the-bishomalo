import { bossRoutes } from './boss.routes';

describe('bossRoutes', () => {
  it('should have a default route', () => {
    expect(bossRoutes[0].path).toBe('');
  });
});
