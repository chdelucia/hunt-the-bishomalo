import type { Preview } from '@storybook/angular';
import { moduleMetadata, applicationConfig } from '@storybook/angular';
import { provideHttpClient } from '@angular/common/http';
import { provideTransloco, TranslocoModule } from '@jsverse/transloco';
import { provideRouter } from '@angular/router';
import { isDevMode } from '@angular/core';
import { TranslocoStorybookLoader } from '../src/lib/transloco-storybook-loader';

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideTransloco({
          config: {
            availableLangs: ['en', 'es'],
            defaultLang: 'es',
            reRenderOnLangChange: true,
            prodMode: !isDevMode(),
          },
          loader: TranslocoStorybookLoader,
        }),
      ],
    }),
    moduleMetadata({
      imports: [TranslocoModule],
    }),
  ],
};

export default preview;
