import type { Meta, StoryObj } from '@storybook/angular';
import { GameMessageComponent } from './game-message.component';
import { fn } from '@storybook/test';

const meta: Meta<GameMessageComponent> = {
  component: GameMessageComponent,
  title: 'GameMessageComponent',
};
export default meta;

type Story = StoryObj<GameMessageComponent>;

export const Win: Story = {
  args: {
    message: 'Victory!',
    isAlive: true,
    hasWon: true,
    size: 5,
    maxLevels: 10,
    lives: 3,
    restartRequested: fn(),
  },
};

export const GameOver: Story = {
  args: {
    message: '¡El Wumpus te devoró!',
    isAlive: false,
    hasWon: false,
    size: 5,
    maxLevels: 10,
    lives: 0,
    restartRequested: fn(),
  },
};

export const Retry: Story = {
  args: {
    message: 'You died',
    isAlive: false,
    hasWon: false,
    size: 5,
    maxLevels: 10,
    lives: 2,
    restartRequested: fn(),
  },
};
