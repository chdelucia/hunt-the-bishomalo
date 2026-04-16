import { initFederation } from '@angular-architects/native-federation';
import { fetchRemoteConfig, buildMergedManifest } from './app/utils/config-loader';

(async () => {
  try {
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const remoteConfig = await fetchRemoteConfig(isDev);
    const manifest = await buildMergedManifest(remoteConfig.remotes);

    await initFederation(manifest);

    (window as unknown as { _REMOTE_CONFIG: unknown })._REMOTE_CONFIG = remoteConfig;

    await import('./bootstrap');
  } catch (err) {
    globalThis.console.error('Critical error during application bootstrap:', err);
  }
})();
