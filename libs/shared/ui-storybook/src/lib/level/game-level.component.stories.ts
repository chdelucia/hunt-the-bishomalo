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
    level: 1,
  },
};

export const HighLevel: Story = {
  args: {
    level: 99,
  },
};
