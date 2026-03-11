import type { Meta, StoryObj } from '@storybook/angular';
import { AchievementProgressComponent } from './achievement-progress.component';
import { expect } from 'storybook/test';

const meta: Meta<AchievementProgressComponent> = {
  component: AchievementProgressComponent,
  title: 'AchievementProgressComponent',
};
export default meta;

type Story = StoryObj<AchievementProgressComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/achievement-progress/gi)).toBeTruthy();
  },
};
