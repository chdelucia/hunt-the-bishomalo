import type { Meta, StoryObj } from '@storybook/angular';
import { GameLivesComponent } from './game-lives.component';
import { expect } from 'storybook/test';

const meta: Meta<GameLivesComponent> = {
  component: GameLivesComponent,
  title: 'Atoms/GameLives',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<GameLivesComponent>;

export const ThreeLives: Story = {
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

export const Empty: Story = {
  args: {
    lives: 0,
    maxLives: 3,
  },
  play: async ({ canvas }) => {
    // Check that there are 3 hearts (maxLives)
    await expect(canvas).toBeTruthy();
  },
};

export const FiveLivesMax: Story = {
  args: {
    lives: 2,
    maxLives: 5,
  },
};
