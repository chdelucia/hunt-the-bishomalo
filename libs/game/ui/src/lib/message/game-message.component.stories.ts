import type { Meta, StoryObj } from '@storybook/angular';
import { GameMessageComponent } from './game-message.component';
import { provideRouter } from '@angular/router';

const meta: Meta<GameMessageComponent> = {
  component: GameMessageComponent,
  title: 'Game/GameMessage',
  decorators: [
    (story) => ({
      ...story,
      moduleMetadata: {
        providers: [provideRouter([])],
      },
    }),
  ],
  argTypes: {
    message: { control: 'text' },
    isAlive: { control: 'boolean' },
    hasWon: { control: 'boolean' },
    size: { control: 'number' },
    maxLevels: { control: 'number' },
    lives: { control: 'number' },
    restartRequested: { action: 'restartRequested' },
  },
};
export default meta;

type Story = StoryObj<GameMessageComponent>;

export const GameOver: Story = {
  args: {
    message: 'Oh no! You fell into a pit!',
    isAlive: false,
    hasWon: false,
    size: 5,
    maxLevels: 10,
    lives: 0,
  },
};

export const Victory: Story = {
  args: {
    message: 'Congratulations! You found the gold!',
    isAlive: true,
    hasWon: true,
    size: 5,
    maxLevels: 10,
    lives: 3,
  },
};

export const NextLevel: Story = {
  args: {
    message: 'Level cleared!',
    isAlive: true,
    hasWon: true,
    size: 5,
    maxLevels: 10,
    lives: 3,
  },
};
