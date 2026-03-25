import type { Meta, StoryObj } from '@storybook/angular';
import { AchievementItemComponent } from './achievement-item.component';
import { expect } from 'storybook/test';
import { Achievement } from '@hunt-the-bishomalo/shared-data';

const meta: Meta<AchievementItemComponent> = {
  component: AchievementItemComponent,
  title: 'Molecules/AchievementItem',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<AchievementItemComponent>;

const mockAchievement: Achievement = {
  id: '1',
  title: 'First Win',
  description: 'You won your first game!',
  svgIcon: 'trophy',
  unlocked: true,
  rarity: 'common',
};

export const Unlocked: Story = {
  args: {
    achievement: mockAchievement,
  },
  play: async ({ canvas, step }) => {
    await step('Verify achievement title is displayed', async () => {
      await expect(canvas.getByText(/First Win/i)).toBeTruthy();
    });
    await step('Verify achievement description is displayed', async () => {
        await expect(canvas.getByText(/You won your first game!/i)).toBeTruthy();
      });
  },
};

export const Locked: Story = {
  args: {
    achievement: { ...mockAchievement, unlocked: false },
  },
};

export const Rare: Story = {
    args: {
      achievement: { ...mockAchievement, rarity: 'rare' },
    },
  };
