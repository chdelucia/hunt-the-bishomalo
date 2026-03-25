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

export const Gold: Story = {
  args: {
    content: {
      type: 'gold',
      image: 'boardicons/gold.svg',
      alt: 'gold coin',
      ariaLabel: 'gold',
    },
  },
};

export const Pit: Story = {
  args: {
    content: {
      type: 'pit',
      image: 'boardicons/pit.svg',
      alt: 'pit',
      ariaLabel: 'pit',
    },
  },
};

export const Arrow: Story = {
  args: {
    content: {
      type: 'arrow',
      image: 'boardicons/arrow.svg',
      alt: 'arrow',
      ariaLabel: 'arrow',
    },
  },
};

export const Heart: Story = {
  args: {
    content: {
      type: 'heart',
      image: 'boardicons/heart.svg',
      alt: 'extra life',
      ariaLabel: 'heart',
    },
  },
};

export const Dragonball: Story = {
  args: {
    content: {
      type: 'dragonball',
      image: 'boardicons/b4.png',
      alt: 'dragonball',
      ariaLabel: 'dragonball',
    },
  },
};
