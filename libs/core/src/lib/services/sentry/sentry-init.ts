import * as Sentry from '@sentry/angular';
import { isDevMode } from '@angular/core';

export function initSentry() {
  Sentry.init({
    dsn: 'https://15af7b49ea08b61d41558122d880e156@o4511065793036288.ingest.de.sentry.io/4511065826197584',
    sendDefaultPii: true,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration()
    ],
    tracesSampleRate: 1.0,
    tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
    replaysSessionSampleRate: isDevMode() ? 1.0 : 0.1,
    replaysOnErrorSampleRate: 1.0,
    enableLogs: true
  });
}
