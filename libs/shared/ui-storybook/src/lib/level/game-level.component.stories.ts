import type { Meta, StoryObj } from '@storybook/angular';
import { GameLevelComponent } from './game-level.component';

const meta: Meta<GameLevelComponent> = {
  component: GameLevelComponent,
  title: 'GameLevelComponent',
};
export default meta;

type Story = StoryObj<GameLevelComponent>;

export const LevelOne: Story = {
  args: {
    size: 4,
  },
};

export const HighLevel: Story = {
  args: {
    size: 102,
  },
};
