import type { Meta, StoryObj } from '@storybook/angular';
import { GameCellComponent } from './game-cell.component';
import { expect } from 'storybook/test';

const meta: Meta<GameCellComponent> = {
  component: GameCellComponent,
  title: 'GameCellComponent',
};
export default meta;

type Story = StoryObj<GameCellComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/game-cell/gi)).toBeTruthy();
  },
};
