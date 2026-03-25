import type { Meta, StoryObj } from '@storybook/angular';
import { GameMessageComponent } from './game-message.component';
import { expect, fn } from 'storybook/test';
import { provideRouter } from '@angular/router';
import { applicationConfig } from '@storybook/angular';

const meta: Meta<GameMessageComponent> = {
  component: GameMessageComponent,
  title: 'Organisms/GameMessage',
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideRouter([])],
    }),
  ],
};
export default meta;

type Story = StoryObj<GameMessageComponent>;

export const GameWon: Story = {
  args: {
    message: 'You Won!',
    isAlive: true,
    hasWon: true,
    size: 4,
    maxLevels: 3,
    lives: 3,
    restartRequested: fn(),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/You Won!/)).toBeTruthy();
  },
};

export const GameLost: Story = {
  args: {
    message: 'You Died!',
    isAlive: false,
    hasWon: false,
    size: 4,
    maxLevels: 3,
    lives: 0,
    restartRequested: fn(),
  },
};

export const DragonBall: Story = {
  args: {
    message: 'Found drac!',
    isAlive: true,
    hasWon: false,
    size: 4,
    maxLevels: 3,
    lives: 3,
  },
  play: async ({ canvas }) => {
    // Should see dragonball icon
    await expect(canvas.getByRole('img', { hidden: true })).toBeTruthy();
  },
};
