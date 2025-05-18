import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const secretGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const nav = router.getCurrentNavigation();
  const cameFromSecretPath = nav?.extras?.state?.['fromSecretPath'];

  if (cameFromSecretPath) {
    return true;
  }
  router.navigateByUrl('/home');
  return false;
};
