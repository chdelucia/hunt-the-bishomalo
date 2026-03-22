import { inject, isDevMode } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RouteTypes } from '@hunt-the-bishomalo/shared-data';

export const secretGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (isDevMode()) {
    return true;
  }

  const nav = router.currentNavigation();
  const cameFromSecretPath = nav?.extras?.state?.['fromSecretPath'];

  if (cameFromSecretPath) {
    return true;
  }
  router.navigateByUrl(RouteTypes.HOME);
  return false;
};
