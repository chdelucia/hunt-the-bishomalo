import type { Meta, StoryObj } from '@storybook/angular';
import { AchievementFilterComponent } from './achievement-filter.component';
import { expect, fn, userEvent } from 'storybook/test';

const meta: Meta<AchievementFilterComponent> = {
  component: AchievementFilterComponent,
  title: 'Molecules/AchievementFilter',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<AchievementFilterComponent>;

export const Default: Story = {
  args: {
    currentFilter: 'all',
    filterChanged: fn(),
  },
  play: async ({ canvas, args, step }) => {
    await step('Verify initial filter state', async () => {
        const allBtn = canvas.getByRole('button', { name: /all/i });
        await expect(allBtn).toBeTruthy();
    });

    await step('Click "unlocked" filter', async () => {
      const unlockedBtn = canvas.getByRole('button', { name: /unlocked/i });
      await userEvent.click(unlockedBtn);
      await expect(args.filterChanged).toHaveBeenCalledWith('unlocked');
    });

    await step('Click "locked" filter', async () => {
        const lockedBtn = canvas.getByRole('button', { name: /locked/i });
        await userEvent.click(lockedBtn);
        await expect(args.filterChanged).toHaveBeenCalledWith('locked');
      });
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
