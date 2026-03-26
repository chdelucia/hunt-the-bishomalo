export interface RemoteConfig {
  remotes: Record<string, string>;
}

export async function fetchRemoteConfig(isDev: boolean): Promise<RemoteConfig> {
  const url = isDev
    ? 'https://bold-mouse-42af.c-heredia-naranjo.workers.dev/mfe-remotes.dev.json'
    : 'https://bold-mouse-42af.c-heredia-naranjo.workers.dev/mfe-remotes.prod.json';

  try {
    const res = await fetch(url);
    return (await res.json()) as RemoteConfig;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load remote configuration', error);
    // Fallback to empty remotes if fetch fails
    return { remotes: {} };
  }
}

export function buildManifest(remotes: Record<string, string>): Record<string, string> {
  return Object.entries(remotes).reduce(
    (acc, [key, url]) => {
      acc[key] = url;
      return acc;
    },
    {} as Record<string, string>,
  );
}
