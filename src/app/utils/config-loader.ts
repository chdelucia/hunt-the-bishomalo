export interface RemoteConfig {
  remotes: Record<string, string>;
}

export async function fetchRemoteConfig(isDev: boolean): Promise<RemoteConfig> {
  const url = isDev ? '/mfe-remotes.dev.json' : '/mfe-remotes.prod.json';

  // Fallback / Debug Override (localStorage) - Restricted to Dev
  if (isDev) {
    const localOverride = localStorage.getItem('MFE_REMOTES_OVERRIDE');
    if (localOverride) {
      try {
        return JSON.parse(localOverride) as RemoteConfig;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Invalid MFE_REMOTES_OVERRIDE found in localStorage', e);
      }
    }
  }

  try {
    const res = await fetch(url);
    const data = await res.json();
    return { remotes: data as Record<string, string> };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load remote configuration from CDN', error);
    // Fallback to empty remotes if fetch fails
    return { remotes: {} };
  }
}

export async function buildMergedManifest(cdnRemotes: Record<string, string>): Promise<Record<string, string>> {
  let localManifest: Record<string, string> = {};
  try {
    const res = await fetch('federation.manifest.json');
    localManifest = (await res.json()) as Record<string, string>;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to load local federation.manifest.json', e);
  }

  return {
    ...localManifest,
    ...cdnRemotes,
  };
}
