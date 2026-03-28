import { initFederation } from '@angular-architects/native-federation';
import { fetchRemoteConfig } from './app/utils/config-loader';

(async () => {
  // We can't use isDevMode() from @angular/core here to avoid early loading of Angular
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  const [config, manifest] = await Promise.all([
    fetchRemoteConfig(isDev),
    fetch('federation.manifest.json')
      .then((res) => res.json())
      .catch(() => ({})),
  ]);

  const mergedManifest = {
    ...(manifest as Record<string, string>),
    ...config.remotes,
  };

  await initFederation(mergedManifest);

  (window as unknown as { _REMOTE_CONFIG: unknown })._REMOTE_CONFIG = config;

  await import('./bootstrap');
})().catch((err) => {
  globalThis.console.error(err);
});
