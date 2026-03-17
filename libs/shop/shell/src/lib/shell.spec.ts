import { shopRoutes } from './shop.routes';

describe('shopRoutes', () => {
  it('should have a default route', () => {
    expect(shopRoutes[0].path).toBe('');
  });
});
