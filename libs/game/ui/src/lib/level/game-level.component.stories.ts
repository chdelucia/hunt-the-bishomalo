import type { Meta, StoryObj } from '@storybook/angular';
import { GameLevelComponent } from './game-level.component';
import { expect } from 'storybook/test';

const meta: Meta<GameLevelComponent> = {
  component: GameLevelComponent,
  title: 'Atoms/GameLevel',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<GameLevelComponent>;

export const LevelOne: Story = {
  args: {
    size: 4,
  },
};

export const LevelTwo: Story = {
  args: {
    size: 5,
  },
  play: async ({ canvas }) => {
    // 5 - 4 + 1 = 2
    await expect(canvas.getByText(/2/i)).toBeTruthy();
  },
};
