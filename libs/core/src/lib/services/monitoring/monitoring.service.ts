import { Injectable, inject } from '@angular/core';
import { LogRocketService } from './logrocket.service';
import { SentryService } from './sentry.service';

@Injectable({
  providedIn: 'root',
})
export class MonitoringService {
  private readonly logRocketService = inject(LogRocketService);
  private readonly sentryService = inject(SentryService);

  /**
   * Initializes all monitoring services and their integrations.
   */
  public init(): void {
    this.logRocketService.init();
    this.integrateLogRocketWithSentry();
  }

  /**
   * Links LogRocket session URL to Sentry events.
   */
  private integrateLogRocketWithSentry(): void {
    this.logRocketService.getSessionURL((sessionURL) => {
      this.sentryService.setTag('logrocket_session_url', sessionURL);
    });
  }
}
