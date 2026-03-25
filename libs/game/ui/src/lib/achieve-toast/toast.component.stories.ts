import type { Meta, StoryObj } from '@storybook/angular';
import { ToastComponent } from './toast.component';
import { expect } from 'storybook/test';
import { Achievement } from '@hunt-the-bishomalo/shared-data';

const meta: Meta<ToastComponent> = {
  component: ToastComponent,
  title: 'Atoms/Toast',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<ToastComponent>;

export const Primary: Story = {
  args: {
    achievement: {
      id: '1',
      title: 'First Win',
      description: 'You won your first game!',
      svgIcon: 'trophy',
      unlocked: true,
      rarity: 'common',
    } as Achievement,
  },
};

export const MultipleToasts: Story = {
  args: {
    achievement: {
      id: '1',
      title: 'First Win',
      description: 'You won your first game!',
      svgIcon: 'trophy',
      unlocked: true,
      rarity: 'common',
    } as Achievement,
  },
  play: async ({ canvas, step }) => {
    await step('Verify toast is displayed', async () => {
      await expect(canvas.getByText(/First Win/i)).toBeTruthy();
    });
  },
};
