import { initFederation } from '@angular-architects/native-federation';
import { fetchRemoteConfig, buildMergedManifest } from './app/utils/config-loader';

(async () => {
  // We can't use isDevMode() from @angular/core here to avoid early loading of Angular
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const config = await fetchRemoteConfig(isDev);

  // We merge local manifest (with shared libs) with the dynamic remotes from CDN
  const manifest = await buildMergedManifest(config.remotes);

  await initFederation(manifest);

  // Store config in a global variable to be picked up by the app
  (window as unknown as { _REMOTE_CONFIG: unknown })._REMOTE_CONFIG = config;

  await import('./bootstrap');
})().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
});
