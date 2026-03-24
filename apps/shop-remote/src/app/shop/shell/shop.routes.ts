import { Routes } from '@angular/router';

export const shopRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../feature/shop.component').then(m => m.ShopComponent)
  }
];
