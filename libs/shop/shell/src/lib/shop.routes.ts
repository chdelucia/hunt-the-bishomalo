import { Routes } from '@angular/router';

export const shopRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@hunt-the-bishomalo/shop/feature').then(m => m.ShopComponent)
  }
];
