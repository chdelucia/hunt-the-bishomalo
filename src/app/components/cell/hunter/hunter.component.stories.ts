import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { HunterComponent } from './hunter.component';
import { Direction } from '@hunt-the-bishomalo/data';
import { TranslocoModule } from '@jsverse/transloco';
import { provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from '../../../utils/transloco-loader';

const meta: Meta<HunterComponent> = {
  title: 'Game/Hunter',
  component: HunterComponent,
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
          loader: TranslocoHttpLoader,
        }),
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<HunterComponent>;

export const Default: Story = {
  args: {
    direction: Direction.RIGHT,
    arrows: 3,
    selectedChar: 'default',
    hasGold: false,
    size: 4,
    hasLantern: false,
    hasShield: false,
  },
};

export const WithGold: Story = {
  args: {
    direction: Direction.RIGHT,
    arrows: 1,
    selectedChar: 'default',
    hasGold: true,
    size: 4,
    hasLantern: false,
    hasShield: false,
  },
};

export const Upward: Story = {
  args: {
    direction: Direction.UP,
    arrows: 3,
    selectedChar: 'default',
    hasGold: false,
    size: 4,
    hasLantern: false,
    hasShield: false,
  },
};
