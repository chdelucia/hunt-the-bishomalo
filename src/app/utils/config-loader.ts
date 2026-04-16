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
        return JSON.parse(localOverride) as RemoteConfig;
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

    return (await response.json()) as RemoteConfig;
  } catch (error) {
    globalThis.console.error('Failed to load remote configuration from CDN', error);
    return { remotes: {} };
  }
}

/**
 * Merges the local federation manifest with the remotes fetched from the CDN.
 * Remote configurations take precedence over local ones.
 */
export async function buildMergedManifest(cdnRemotes: Record<string, string>): Promise<Record<string, string>> {
  let localManifest: Record<string, string> = {};

  try {
    const response = await fetch('federation.manifest.json');
    if (response.ok) {
      localManifest = (await response.json()) as Record<string, string>;
    }
  } catch (error) {
    globalThis.console.warn('Local federation.manifest.json not found or inaccessible', error);
  }

  return {
    ...localManifest,
    ...cdnRemotes,
  };
}
