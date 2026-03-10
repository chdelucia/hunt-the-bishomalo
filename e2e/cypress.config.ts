import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'bun x nx run hunt-the-bishomalo:serve',
        production: 'bun x nx run hunt-the-bishomalo:serve-static',
      },
      ciWebServerCommand: 'bun x nx run hunt-the-bishomalo:serve-static',
      ciBaseUrl: 'http://localhost:4200',
    }),
    baseUrl: 'http://localhost:4200',
    setupNodeEvents(on) {
      on('before:browser:launch', (browser = {} as Cypress.Browser, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.args.push('--mute-audio');
          launchOptions.args.push('--disable-audio-output');
        }
        return launchOptions;
      });
    },
  },
});
