import { Injectable, isDevMode } from '@angular/core';
import LogRocket from 'logrocket';

@Injectable({
  providedIn: 'root',
})
export class LogRocketService {
  private readonly LOGROCKET_PROJECT_ID = 'mrbd1e/espabilatech';

  /**
   * Initializes LogRocket if not in development mode.
   */
  public init(): void {
    if (this.isDev()) {
      return;
    }

    LogRocket.init(this.LOGROCKET_PROJECT_ID);
  }

  public getSessionURL(callback: (url: string) => void): void {
    if (this.isDev()) {
      return;
    }
    LogRocket.getSessionURL(callback);
  }

  private isDev(): boolean {
    return isDevMode();
  }
}
