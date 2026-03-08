import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { AchievementItemComponent } from './achievement-item.component';
import { TranslocoModule } from '@jsverse/transloco';
import { provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from '../../../utils/transloco-loader';

const meta: Meta<AchievementItemComponent> = {
  title: 'Achievements/AchievementItem',
  component: AchievementItemComponent,
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
type Story = StoryObj<AchievementItemComponent>;

export const UnlockedCommon: Story = {
  args: {
    achievement: {
      id: '1',
      title: 'Logro 1',
      description: 'Descripción del logro 1',
      rarity: 'common',
      unlocked: true,
      svgIcon: 'assets/icons/trophy.svg',
    },
  },
};

export const LockedRare: Story = {
  args: {
    achievement: {
      id: '2',
      title: 'Logro 2',
      description: 'Descripción del logro 2',
      rarity: 'rare',
      unlocked: false,
      svgIcon: 'assets/icons/trophy.svg',
    },
  },
};

export const Legendary: Story = {
  args: {
    achievement: {
      id: '3',
      title: 'Logro Legendario',
      description: 'Solo para los mejores',
      rarity: 'legendary',
      unlocked: true,
      svgIcon: 'assets/icons/trophy.svg',
    },
  },
};
