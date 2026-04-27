import { prototypePollutionReviver } from '@hunt-the-bishomalo/shared-util';

export interface RemoteConfig {
  remotes: Record<string, string>;
}

/**
 * Fetches the remote configuration from the CDN.
 * Includes a timeout to prevent the application from hanging on slow networks.
 */
export async function fetchRemoteConfig(isDev: boolean): Promise<RemoteConfig> {
  const url = isDev
    ? 'https://bold-mouse-42af.c-heredia-naranjo.workers.dev/mfe-remotes.dev.json'
    : 'https://huntthebishomalo.c-heredia-naranjo.workers.dev/mfe-remotes.prod.json';

  if (isDev) {
    const localOverride = localStorage.getItem('MFE_REMOTES_OVERRIDE');
    if (localOverride) {
      try {
        return JSON.parse(localOverride, prototypePollutionReviver) as RemoteConfig;
      } catch (e) {
        globalThis.console.warn('Invalid MFE_REMOTES_OVERRIDE found in localStorage', e);
      }
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    return JSON.parse(data, prototypePollutionReviver) as RemoteConfig;
  } catch (error) {
    globalThis.console.error('Failed to load remote configuration from CDN', error);
    return { remotes: {} };
  }
}

/**
 * Fetches the local federation manifest.
 */
export async function fetchLocalManifest(): Promise<Record<string, string>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);

    const response = await fetch('federation.manifest.json', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.text();
      return JSON.parse(data, prototypePollutionReviver) as Record<string, string>;
    }
  } catch (error) {
    globalThis.console.warn('Local federation.manifest.json not found or inaccessible', error);
  }
  return {};
}

/**
 * Merges the local federation manifest with the remotes fetched from the CDN.
 * Remote configurations take precedence over local ones.
 */
export function buildMergedManifest(
  localManifest: Record<string, string>,
  cdnRemotes: Record<string, string>,
): Record<string, string> {
  return {
    ...localManifest,
    ...cdnRemotes,
  };
}
