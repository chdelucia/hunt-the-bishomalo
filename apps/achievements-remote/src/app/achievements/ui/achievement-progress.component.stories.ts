import type { Meta, StoryObj } from '@storybook/angular';
import { AchievementProgressComponent } from './achievement-progress.component';
import { expect } from 'storybook/test';

const meta: Meta<AchievementProgressComponent> = {
  component: AchievementProgressComponent,
  title: 'Molecules/AchievementProgress',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<AchievementProgressComponent>;

export const Default: Story = {
  args: {
    unlockedCount: 5,
    totalCount: 10,
    percentage: 50,
  },
  play: async ({ canvas, step }) => {
    await step('Verify progress text is displayed', async () => {
      await expect(canvas.getByText(/5 \/ 10/)).toBeTruthy();
      await expect(canvas.getByText(/50%/)).toBeTruthy();
    });
  },
};

export const Completed: Story = {
  args: {
    unlockedCount: 10,
    totalCount: 10,
    percentage: 100,
  },
};

export const Empty: Story = {
  args: {
    unlockedCount: 0,
    totalCount: 10,
    percentage: 0,
  },
};
