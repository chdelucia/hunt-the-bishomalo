import type { Meta, StoryObj } from '@storybook/angular';
import { GameMessageDisplayComponent } from './game-message-display.component';
import { expect } from 'storybook/test';

const meta: Meta<GameMessageDisplayComponent> = {
  component: GameMessageDisplayComponent,
  title: 'Atoms/GameMessageDisplay',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<GameMessageDisplayComponent>;

export const Primary: Story = {
  args: {
    message: 'Hello World',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Hello World/gi)).toBeTruthy();
  },
};
