import type { Meta, StoryObj } from '@storybook/angular';
import { GameMessageComponent } from './game-message.component';
import { expect } from 'storybook/test';

const meta: Meta<GameMessageComponent> = {
  component: GameMessageComponent,
  title: 'GameMessageComponent',
};
export default meta;

type Story = StoryObj<GameMessageComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/game-message/gi)).toBeTruthy();
  },
};
