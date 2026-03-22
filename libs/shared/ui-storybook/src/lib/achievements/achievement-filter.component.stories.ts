import type { Meta, StoryObj } from '@storybook/angular';
import { AchievementFilterComponent } from './achievement-filter.component';
import { fn } from '@storybook/test';

const meta: Meta<AchievementFilterComponent> = {
  component: AchievementFilterComponent,
  title: 'AchievementFilterComponent',
};
export default meta;

type Story = StoryObj<AchievementFilterComponent>;

export const All: Story = {
  args: {
    currentFilter: 'all',
    filterChanged: fn(),
  },
};

export const Unlocked: Story = {
  args: {
    currentFilter: 'unlocked',
    filterChanged: fn(),
  },
};

export const Locked: Story = {
  args: {
    currentFilter: 'locked',
    filterChanged: fn(),
  },
};
