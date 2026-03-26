import { bootstrapApplication } from '@angular/platform-browser';
import * as Sentry from '@sentry/angular';

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

Sentry.init({
  dsn: 'https://15af7b49ea08b61d41558122d880e156@o4511065793036288.ingest.de.sentry.io/4511065826197584',
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: false,
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  // Tracing
  tracesSampleRate: 1, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  // Enable sending logs to Sentry
  enableLogs: true,
});

try {
  await bootstrapApplication(AppComponent, appConfig);
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(err);
}
