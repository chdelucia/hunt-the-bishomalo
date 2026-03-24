import type { Meta, StoryObj } from '@storybook/angular';
import { ToastComponent } from './toast.component';
import { Achievement } from '@hunt-the-bishomalo/shared-data';

const meta: Meta<ToastComponent> = {
  component: ToastComponent,
  title: 'Game/Toast',
};
export default meta;

type Story = StoryObj<ToastComponent>;

const mockAchievement: Achievement = {
  id: 'first-gold',
  title: 'First Gold!',
  description: 'You found your first gold coin.',
  icon: 'gold',
  svgIcon: 'assets/icons/gold.svg',
  rarity: 'common',
  unlocked: true,
};

export const Default: Story = {
  args: {
    achievement: mockAchievement,
  },
};

export const RareAchievement: Story = {
  args: {
    achievement: {
      ...mockAchievement,
      id: 'slayer',
      title: 'Wumpus Slayer',
      rarity: 'rare',
      svgIcon: 'assets/icons/wumpus.svg',
    },
  },
};
