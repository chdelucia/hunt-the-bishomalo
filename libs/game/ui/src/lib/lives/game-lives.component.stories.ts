import type { Meta, StoryObj } from '@storybook/angular';
import { GameLivesComponent } from './game-lives.component';
import { expect } from 'storybook/test';

const meta: Meta<GameLivesComponent> = {
  component: GameLivesComponent,
  title: 'GameLivesComponent',
};
export default meta;

type Story = StoryObj<GameLivesComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/game-lives/gi)).toBeTruthy();
  },
};
