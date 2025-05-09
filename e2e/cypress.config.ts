import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'npx nx run hunt-the-bishomalo:serve',
        production: 'npx nx run hunt-the-bishomalo:serve-static',
      },
      ciWebServerCommand: 'npx nx run hunt-the-bishomalo:serve-static',
      ciBaseUrl: 'http://localhost:4200',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
