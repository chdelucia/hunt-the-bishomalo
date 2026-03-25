import type { Meta, StoryObj } from '@storybook/angular';
import { CellContentComponent } from './cell-content.component';
import { expect } from 'storybook/test';

const meta: Meta<CellContentComponent> = {
  component: CellContentComponent,
  title: 'Atoms/CellContent',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<CellContentComponent>;

export const Primary: Story = {
  args: {
    content: {
      type: 'wumpus',
      image: 'chars/link/wumpus.png',
      alt: 'wumpus',
      ariaLabel: 'wumpus',
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img')).toBeTruthy();
  },
};
