import { Injectable, InjectionToken, inject } from '@angular/core';

export interface RemoteConfig {
  remotes: Record<string, string>;
}

export const REMOTE_CONFIG_TOKEN = new InjectionToken<RemoteConfig>('REMOTE_CONFIG_TOKEN');

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly config = inject(REMOTE_CONFIG_TOKEN);

  get remotes(): Record<string, string> {
    return this.config?.remotes ?? {};
  }
}
