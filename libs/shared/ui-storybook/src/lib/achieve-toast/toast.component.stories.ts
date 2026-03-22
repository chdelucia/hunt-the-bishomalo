import type { Meta, StoryObj } from '@storybook/angular';
import { ToastComponent } from './toast.component';

const meta: Meta<ToastComponent> = {
  component: ToastComponent,
  title: 'ToastComponent',
};
export default meta;

type Story = StoryObj<ToastComponent>;

export const SingleAchievement: Story = {
  args: {
    achievement: {
      id: '1',
      title: 'Achievement Unlocked!',
      description: 'You did something great!',
      svgIcon: 'boardicons/gold.png',
      unlocked: true,
      rarity: 'common'
    } as any
  },
};
