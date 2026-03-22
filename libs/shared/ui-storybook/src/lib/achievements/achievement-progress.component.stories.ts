import type { Meta, StoryObj } from '@storybook/angular';
import { AchievementProgressComponent } from './achievement-progress.component';

const meta: Meta<AchievementProgressComponent> = {
  component: AchievementProgressComponent,
  title: 'AchievementProgressComponent',
};
export default meta;

type Story = StoryObj<AchievementProgressComponent>;

export const PartialProgress: Story = {
  args: {
    unlockedCount: 5,
    totalCount: 10,
    percentage: 50,
  },
};

export const Completed: Story = {
  args: {
    unlockedCount: 10,
    totalCount: 10,
    percentage: 100,
  },
};
