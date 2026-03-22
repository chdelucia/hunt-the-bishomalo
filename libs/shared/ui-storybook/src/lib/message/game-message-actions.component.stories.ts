import type { Meta, StoryObj } from '@storybook/angular';
import { GameMessageActionsComponent } from './game-message-actions.component';
import { expect } from '@storybook/test';

const meta: Meta<GameMessageActionsComponent> = {
  component: GameMessageActionsComponent,
  title: 'GameMessageActionsComponent',
};
export default meta;

type Story = StoryObj<GameMessageActionsComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/game-message-actions/gi)).toBeTruthy();
  },
};
