import { initFederation } from '@angular-architects/native-federation';
import { fetchRemoteConfig } from './app/utils/config-loader';

(async () => {
  // We can't use isDevMode() from @angular/core here to avoid early loading of Angular
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // Parallelize loading of remote configuration and local manifest
  const [config, localManifest] = await Promise.all([
    fetchRemoteConfig(isDev),
    fetch('federation.manifest.json')
      .then((res) => res.json())
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.warn('Failed to load local federation.manifest.json', e);
        return {};
      }),
  ]);

  // Merge manifest and initialize federation
  await initFederation({
    ...(localManifest as Record<string, string>),
    ...config.remotes,
  });

  // Store config in a global variable to be picked up by the app
  (window as unknown as { _REMOTE_CONFIG: unknown })._REMOTE_CONFIG = config;

  await import('./bootstrap');
})().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
});
