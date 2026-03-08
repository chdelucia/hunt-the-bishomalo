import { Meta, StoryObj } from '@storybook/angular';
import { GameLivesComponent } from './game-lives.component';

const meta: Meta<GameLivesComponent> = {
  title: 'Components/GameLives',
  component: GameLivesComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<GameLivesComponent>;

export const Default: Story = {
  args: {
    lives: 3,
    maxLives: 5,
  },
};

export const LowLives: Story = {
  args: {
    lives: 1,
    maxLives: 5,
  },
};

export const FullLives: Story = {
  args: {
    lives: 5,
    maxLives: 5,
  },
};
