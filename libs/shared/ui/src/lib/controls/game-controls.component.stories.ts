import type { Meta, StoryObj } from '@storybook/angular';
import { GameControlsComponent } from './game-controls.component';
import { expect } from 'storybook/test';

const meta: Meta<GameControlsComponent> = {
  component: GameControlsComponent,
  title: 'GameControlsComponent',
};
export default meta;

type Story = StoryObj<GameControlsComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/game-controls/gi)).toBeTruthy();
  },
};
