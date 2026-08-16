export interface RemoteConfig {
  remotes: Record<string, string>;
}

/**
 * Reviver function for JSON.parse to neutralize prototype pollution keys.
 */
function safeJsonReviver(key: string, value: unknown): unknown {
  if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
    return undefined;
  }
  return value;
}

/**
 * Safely parses JSON string with prototype pollution neutralization.
 */
export function safeJsonParse<T>(jsonString: string): T | null {
  try {
    const parsed = JSON.parse(jsonString, safeJsonReviver) as T;
    if (parsed && typeof parsed === 'object') {
      if (
        Object.prototype.hasOwnProperty.call(parsed, '__proto__') ||
        Object.prototype.hasOwnProperty.call(parsed, 'constructor') ||
        Object.prototype.hasOwnProperty.call(parsed, 'prototype')
      ) {
        return null;
      }
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Fetches the remote configuration from the CDN.
 * Includes override handling in dev mode with prototype pollution protection.
 */
export async function fetchRemoteConfig(isDev: boolean): Promise<RemoteConfig> {
  const url = isDev
    ? 'https://bold-mouse-42af.c-heredia-naranjo.workers.dev/mfe-remotes.dev.json'
    : 'https://huntthebishomalo.c-heredia-naranjo.workers.dev/mfe-remotes.prod.json';

  if (isDev) {
    const localOverride = localStorage.getItem('MFE_REMOTES_OVERRIDE');
    if (localOverride) {
      const parsed = safeJsonParse<RemoteConfig>(localOverride);
      if (parsed && parsed.remotes && typeof parsed.remotes === 'object') {
        return parsed;
      }
      globalThis.console.warn('Invalid MFE_REMOTES_OVERRIDE found in localStorage');
    }
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as RemoteConfig;
    if (data && typeof data === 'object' && data.remotes && typeof data.remotes === 'object') {
      return data;
    }
    return { remotes: {} };
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
    const response = await fetch('federation.manifest.json');

    if (response.ok) {
      const data = (await response.json()) as Record<string, string>;
      if (data && typeof data === 'object') {
        return data;
      }
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
  localManifest?: Record<string, string> | null,
  cdnRemotes?: Record<string, string> | null,
): Record<string, string> {
  const safeLocal = localManifest && typeof localManifest === 'object' ? localManifest : {};
  const safeCdn = cdnRemotes && typeof cdnRemotes === 'object' ? cdnRemotes : {};

  return {
    ...safeLocal,
    ...safeCdn,
  };
}
