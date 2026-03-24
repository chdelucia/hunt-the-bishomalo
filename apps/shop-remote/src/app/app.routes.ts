import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('./shop/shell/shop.routes').then(m => m.shopRoutes)
  }
];
