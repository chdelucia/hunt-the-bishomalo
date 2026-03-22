import { shopRoutes } from './shop.routes';

describe('shopRoutes', () => {
  it('should have a default route', () => {
    expect(shopRoutes[0].path).toBe('');
  });

  it('should load ShopComponent', async () => {
    const route = shopRoutes[0];
    if (route.loadComponent) {
      const component = await (route.loadComponent() as Promise<any>);
      expect(component).toBeTruthy();
    }
  });
});
