import { Injectable, isDevMode } from '@angular/core';
import LogRocket from 'logrocket';

@Injectable({
  providedIn: 'root',
})
export class LogRocketService {
  private readonly LOGROCKET_PROJECT_ID = 'mrbd1e/espabilatech';

  /**
   * Initializes LogRocket if not in development mode or if explicitly requested.
   */
  public init(): void {
    if (this.isDev()) {
      return;
    }

    LogRocket.init(this.LOGROCKET_PROJECT_ID);
  }

  private isDev(): boolean {
    return isDevMode();
  }
}
