import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LogRocketService {
  private readonly LOGROCKET_PROJECT_ID = 'mrbd1e/espabilatech';

  /**
   * Initializes LogRocket if not in development mode or if explicitly requested.
   */
  public async init(): Promise<void> {
    if (this.isDev()) {
      return;
    }

    const { default: LogRocket } = await import('logrocket');
    LogRocket.init(this.LOGROCKET_PROJECT_ID);
  }

  private isDev(): boolean {
    return isDevMode();
  }
}
