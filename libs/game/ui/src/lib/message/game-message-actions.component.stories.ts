import type { Meta, StoryObj } from '@storybook/angular';
import { GameMessageActionsComponent } from './game-message-actions.component';
import { expect } from 'storybook/test';

const meta: Meta<GameMessageActionsComponent> = {
  component: GameMessageActionsComponent,
  title: 'Atoms/GameMessageActions',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<GameMessageActionsComponent>;

export const Primary: Story = {
  args: {
    shouldShowRetry: true,
    shouldShowNextLevel: false,
    showCongrats: false,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /retry/i })).toBeTruthy();
  },
};
