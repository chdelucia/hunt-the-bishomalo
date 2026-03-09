import { Meta, StoryObj } from '@storybook/angular';
import { GameLivesComponent } from './game-lives.component';

const meta: Meta<GameLivesComponent> = {
  title: 'Shared UI/Game Lives',
  component: GameLivesComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<GameLivesComponent>;

export const FullLives: Story = {
  args: {
    lives: 3,
    maxLives: 3,
  },
};

export const PartialLives: Story = {
  args: {
    lives: 1,
    maxLives: 3,
  },
};

export const NoLives: Story = {
  args: {
    lives: 0,
    maxLives: 3,
  },
};
