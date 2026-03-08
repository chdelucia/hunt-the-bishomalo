import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { AchievementProgressComponent } from './achievement-progress.component';
import { TranslocoModule } from '@jsverse/transloco';
import { provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from '../../../utils/transloco-loader';

const meta: Meta<AchievementProgressComponent> = {
  title: 'Achievements/AchievementProgress',
  component: AchievementProgressComponent,
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
type Story = StoryObj<AchievementProgressComponent>;

export const Initial: Story = {
  args: {
    unlockedCount: 0,
    totalCount: 20,
    percentage: 0,
  },
};

export const HalfWay: Story = {
  args: {
    unlockedCount: 10,
    totalCount: 20,
    percentage: 50,
  },
};

export const Complete: Story = {
  args: {
    unlockedCount: 20,
    totalCount: 20,
    percentage: 100,
  },
};
