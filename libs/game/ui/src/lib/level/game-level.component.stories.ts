import type { Meta, StoryObj } from '@storybook/angular';
import { GameLevelComponent } from './game-level.component';
import { expect } from 'storybook/test';

const meta: Meta<GameLevelComponent> = {
  component: GameLevelComponent,
  title: 'GameLevelComponent',
};
export default meta;

type Story = StoryObj<GameLevelComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/game-level/gi)).toBeTruthy();
  },
};
