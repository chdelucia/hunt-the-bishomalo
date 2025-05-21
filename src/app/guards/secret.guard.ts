import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RouteTypes } from '../models';

export const secretGuard: CanActivateFn = () => {
  const router = inject(Router);

  const nav = router.getCurrentNavigation();
  const cameFromSecretPath = nav?.extras?.state?.['fromSecretPath'];

  if (cameFromSecretPath) {
    return true;
  }
  router.navigateByUrl(RouteTypes.HOME);
  return false;
};
