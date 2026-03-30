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

  /**
   * ⚡ BOLT OPTIMIZATION:
   * Filter out the host application name from the merged manifest.
   * Native Federation might try to load the host's own remoteEntry.json,
   * leading to a redundant self-referential network request during bootstrap.
   * Expected Impact: Reduces 1 unnecessary network request and minor overhead.
   */
  const filteredManifest = Object.fromEntries(
    Object.entries(mergedManifest).filter(([name]) => name !== 'hunt-the-bishomalo'),
  );

  await initFederation(filteredManifest);

  (window as unknown as { _REMOTE_CONFIG: unknown })._REMOTE_CONFIG = config;

  await import('./bootstrap');
})().catch((err) => {
  globalThis.console.error(err);
});
