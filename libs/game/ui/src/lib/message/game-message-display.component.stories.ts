import type { Meta, StoryObj } from '@storybook/angular';
import { GameMessageDisplayComponent } from './game-message-display.component';
import { expect } from 'storybook/test';

const meta: Meta<GameMessageDisplayComponent> = {
  component: GameMessageDisplayComponent,
  title: 'GameMessageDisplayComponent',
};
export default meta;

type Story = StoryObj<GameMessageDisplayComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/game-message-display/gi)).toBeTruthy();
  },
};
