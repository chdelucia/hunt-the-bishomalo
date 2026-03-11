import type { Meta, StoryObj } from '@storybook/angular';
import { AchievementItemComponent } from './achievement-item.component';
import { expect } from 'storybook/test';

const meta: Meta<AchievementItemComponent> = {
  component: AchievementItemComponent,
  title: 'AchievementItemComponent',
};
export default meta;

type Story = StoryObj<AchievementItemComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/achievement-item/gi)).toBeTruthy();
  },
};
