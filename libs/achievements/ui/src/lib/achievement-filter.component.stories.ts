import type { Meta, StoryObj } from '@storybook/angular';
import { AchievementFilterComponent } from './achievement-filter.component';
import { expect } from 'storybook/test';

const meta: Meta<AchievementFilterComponent> = {
  component: AchievementFilterComponent,
  title: 'AchievementFilterComponent',
};
export default meta;

type Story = StoryObj<AchievementFilterComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/achievement-filter/gi)).toBeTruthy();
  },
};
