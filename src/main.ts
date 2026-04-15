import { initFederation } from '@angular-architects/native-federation';
import { fetchRemoteConfig, RemoteConfig } from './app/utils/config-loader';

(async () => {
  // We can't use isDevMode() from @angular/core here to avoid early loading of Angular
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  let mergedManifest: Record<string, string> = {};
  let remoteConfig: RemoteConfig = { remotes: {} };

  try {
    remoteConfig = await fetchRemoteConfig(isDev);
    mergedManifest = remoteConfig.remotes || {};

    // Only load local manifest if remote config is empty or fails
    if (Object.keys(mergedManifest).length === 0) {
      const res = await fetch('federation.manifest.json');
      if (res.ok) {
        mergedManifest = await res.json();
      }
    }
  } catch (err) {
    globalThis.console.warn('Fallback to local manifest due to remote config error', err);
    try {
      const res = await fetch('federation.manifest.json');
      if (res.ok) {
        mergedManifest = await res.json();
      }
    } catch (localErr) {
      globalThis.console.error('Failed to load any manifest', localErr);
    }
  }

  /**
   * ⚡ BOLT OPTIMIZATION:
   * Filter out the host application name from the merged manifest.
   * Native Federation might try to load the host's own remoteEntry.json,
   * leading to a redundant self-referential network request during bootstrap.
   * Expected Impact: Reduces 1 unnecessary network request and minor overhead.
   */
  const filteredManifest = Object.fromEntries(
    Object.entries(mergedManifest).filter(([name]) => name !== 'hunt-the-bishomalo' && name !== 'host'),
  );

  await initFederation(filteredManifest);

  (window as unknown as { _REMOTE_CONFIG: unknown })._REMOTE_CONFIG = remoteConfig;

  await import('./bootstrap');
})().catch((err) => {
  globalThis.console.error(err);
});
