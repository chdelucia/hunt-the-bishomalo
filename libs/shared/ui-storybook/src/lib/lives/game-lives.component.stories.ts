import type { Meta, StoryObj } from '@storybook/angular';
import { GameLivesComponent } from './game-lives.component';

const meta: Meta<GameLivesComponent> = {
  component: GameLivesComponent,
  title: 'GameLivesComponent',
};
export default meta;

type Story = StoryObj<GameLivesComponent>;

export const FullLives: Story = {
  args: {
    lives: 3,
    maxLives: 3,
  },
};

export const OneLife: Story = {
  args: {
    lives: 1,
    maxLives: 3,
  },
};

export const Dead: Story = {
  args: {
    lives: 0,
    maxLives: 3,
  },
};
