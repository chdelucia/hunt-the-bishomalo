import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { AchievementProgressComponent } from './achievement-progress.component';
import { TranslocoModule } from '@jsverse/transloco';

const meta: Meta<AchievementProgressComponent> = {
  title: 'Shared UI/Achievements/Progress',
  component: AchievementProgressComponent,
  decorators: [
    moduleMetadata({
      imports: [TranslocoModule],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<AchievementProgressComponent>;

export const Default: Story = {
  args: {
    unlockedCount: 5,
    totalCount: 20,
    percentage: 25,
  },
};

export const Completed: Story = {
  args: {
    unlockedCount: 20,
    totalCount: 20,
    percentage: 100,
  },
};
