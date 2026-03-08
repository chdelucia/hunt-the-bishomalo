import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { AchievementFilterComponent } from './achievement-filter.component';
import { TranslocoModule } from '@jsverse/transloco';
import { provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from '../../../utils/transloco-loader';

const meta: Meta<AchievementFilterComponent> = {
  title: 'Achievements/AchievementFilter',
  component: AchievementFilterComponent,
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
type Story = StoryObj<AchievementFilterComponent>;

export const AllSelected: Story = {
  args: {
    currentFilter: 'all',
  },
};

export const UnlockedSelected: Story = {
  args: {
    currentFilter: 'unlocked',
  },
};

export const LockedSelected: Story = {
  args: {
    currentFilter: 'locked',
  },
};
