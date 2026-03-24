import { initFederation } from '@angular-architects/native-federation';
import { isDevMode } from '@angular/core';

const manifest = isDevMode()
  ? 'federation.manifest.development.json'
  : 'federation.manifest.json';

initFederation(manifest)
  // eslint-disable-next-line no-console
  .catch((err) => console.error(err))
  .then(() => import('./bootstrap'))
  // eslint-disable-next-line no-console
  .catch((err) => console.error(err));
