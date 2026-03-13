import { InjectionToken } from '@angular/core';
import { ShopComponent } from '@hunt-the-bishomalo/shop/api';

export const SHOP_COMPONENT = new InjectionToken<typeof ShopComponent>('SHOP_COMPONENT');

export * from '@hunt-the-bishomalo/shop/api';
