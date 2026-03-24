import { type Preview, moduleMetadata } from '@storybook/angular';
import { provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from '../src/app/utils/transloco-loader';

const preview: Preview = {
  decorators: [
    moduleMetadata({
      providers: [
        provideHttpClient(),
        provideTransloco({
          config: {
            availableLangs: ['en', 'es'],
            defaultLang: 'es',
            reRenderOnLangChange: true,
            prodMode: false,
          },
          loader: TranslocoHttpLoader,
        }),
      ],
    }),
  ],
};

export default preview;
