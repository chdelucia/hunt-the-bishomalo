import { provideHttpClient } from '@angular/common/http';
import { applicationConfig } from '@storybook/angular';
import { provideTransloco, Translation, TranslocoLoader } from '@jsverse/transloco';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StorybookTranslocoLoader implements TranslocoLoader {
  getTranslation(lang: string) {
    return from(
      fetch(`/assets/i18n/${lang}.json`).then((res) => res.json() as Promise<Translation>)
    );
  }
}

export const decorators = [
  applicationConfig({
    providers: [
      provideHttpClient(),
      provideTransloco({
        config: {
          availableLangs: ['en', 'es'],
          defaultLang: 'en',
          reRenderOnLangChange: true,
          prodMode: false,
        },
        loader: StorybookTranslocoLoader,
      }),
    ],
  }),
];
