import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { TitleComponent } from './title.component';
import { TranslocoModule } from '@jsverse/transloco';
import { provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';

const meta: Meta<TitleComponent> = {
  title: 'Shared/Title',
  component: TitleComponent,
  decorators: [
    moduleMetadata({
      imports: [TranslocoModule],
      providers: [
        provideHttpClient(),
        provideTransloco({
          config: {
            availableLangs: ['en', 'es'],
            defaultLang: 'es',
            reRenderOnLangChange: true,
            prodMode: false,
          },
        }),
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<TitleComponent>;

export const Default: Story = {
  args: {
    blackout: false,
  },
};

export const Blackout: Story = {
  args: {
    blackout: true,
  },
};
