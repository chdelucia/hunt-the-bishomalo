import { Injectable, isDevMode } from '@angular/core';
import * as Sentry from '@sentry/angular';

@Injectable({
  providedIn: 'root',
})
export class SentryService {
  /**
   * Sets a tag in Sentry.
   */
  public setTag(key: string, value: string): void {
    if (isDevMode()) {
      return;
    }
    Sentry.setTag(key, value);
  }

  /**
   * Captures an exception in Sentry.
   */
  public captureException(exception: unknown): void {
    if (isDevMode()) {
      return;
    }
    Sentry.captureException(exception);
  }
}
