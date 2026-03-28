import type { Meta, StoryObj } from '@storybook/angular';
import { GameCellComponent } from './game-cell.component';
import { expect } from 'storybook/test';
import { Chars, Direction, GameItem } from '@hunt-the-bishomalo/shared-data';

const meta: Meta<GameCellComponent> = {
  component: GameCellComponent,
  title: 'Organisms/GameCell',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<GameCellComponent>;

export const VisitedGold: Story = {
  args: {
    cell: { x: 0, y: 0, visited: true, content: { type: 'gold', image: 'boardicons/gold.svg', alt: 'gold coin', ariaLabel: 'gold' } },
    isAlive: true,
    hasWon: false,
    inventory: [],
    selectedChar: Chars.DEFAULT,
    size: 4,
    blackout: false,
    isHunterCell: false,
    hunter: null,
  },
};

export const HunterCell: Story = {
  args: {
    cell: { x: 1, y: 1, visited: true },
    isAlive: true,
    hasWon: false,
    inventory: [],
    selectedChar: Chars.LINK,
    size: 4,
    blackout: false,
    isHunterCell: true,
    hunter: { x: 1, y: 1, direction: Direction.UP, arrows: 3, hasGold: false, inventory: [], gold: 0 },
  },
  play: async ({ canvas }) => {
    // Should see hunter component
    await expect(canvas.getByRole('img', { hidden: true })).toBeTruthy();
  },
};

export const BlackoutWithLantern: Story = {
  args: {
    cell: { x: 1, y: 1, visited: false, content: { type: 'pit', image: 'boardicons/pit.svg', alt: 'pit', ariaLabel: 'pit' } },
    isAlive: true,
    hasWon: false,
    inventory: [{ id: 'lantern', name: 'lantern', effect: 'lantern', description: 'lantern', icon: 'lantern' } as GameItem],
    selectedChar: Chars.DEFAULT,
    size: 4,
    blackout: true,
    isHunterCell: false,
  },
};

export const Arrow: Story = {
  args: {
    cell: {
      x: 0,
      y: 0,
      visited: true,
      content: { type: 'arrow', image: 'boardicons/arrow.svg', alt: 'arrow', ariaLabel: 'arrow' },
    },
    isAlive: true,
    hasWon: false,
    inventory: [],
    selectedChar: Chars.DEFAULT,
    size: 4,
    blackout: false,
    isHunterCell: false,
  },
};

export const Heart: Story = {
  args: {
    cell: {
      x: 0,
      y: 0,
      visited: true,
      content: { type: 'heart', image: 'boardicons/heart.svg', alt: 'extra life', ariaLabel: 'heart' },
    },
    isAlive: true,
    hasWon: false,
    inventory: [],
    selectedChar: Chars.DEFAULT,
    size: 4,
    blackout: false,
    isHunterCell: false,
  },
};

export const Dragonball: Story = {
  args: {
    cell: {
      x: 0,
      y: 0,
      visited: true,
      content: { type: 'dragonball', image: 'boardicons/b4.png', alt: 'dragonball', ariaLabel: 'dragonball' },
    },
    isAlive: true,
    hasWon: false,
    inventory: [],
    selectedChar: Chars.DEFAULT,
    size: 4,
    blackout: false,
    isHunterCell: false,
  },
};

export const PitVisible: Story = {
  args: {
    cell: {
      x: 0,
      y: 0,
      visited: true,
      content: { type: 'pit', image: 'boardicons/pit.svg', alt: 'pit', ariaLabel: 'pit' },
    },
    isAlive: true,
    hasWon: false,
    inventory: [],
    selectedChar: Chars.DEFAULT,
    size: 4,
    blackout: false,
    isHunterCell: false,
  },
};

export const Wumpus: Story = {
  args: {
    cell: {
      x: 0,
      y: 0,
      visited: true,
      content: {
        type: 'wumpus',
        image: 'chars/default/wumpus.svg',
        alt: 'wumpus',
        ariaLabel: 'wumpus',
      },
    },
    isAlive: true,
    hasWon: false,
    inventory: [],
    selectedChar: Chars.DEFAULT,
    size: 4,
    blackout: false,
    isHunterCell: false,
  },
};

export const Pit: Story = {
  args: {
    cell: {
      x: 0,
      y: 0,
      visited: true,
      content: { type: 'pit', image: 'boardicons/pit.svg', alt: 'pit', ariaLabel: 'pit' },
    },
    isAlive: true,
    hasWon: false,
    inventory: [],
    selectedChar: Chars.DEFAULT,
    size: 4,
    blackout: false,
    isHunterCell: false,
  },
};

export const SecretGold: Story = {
  args: {
    cell: {
      x: 0,
      y: 0,
      visited: false,
      content: {
        type: 'extragold',
        image: 'boardicons/question.png',
        alt: 'secret',
        ariaLabel: 'secret',
      },
    },
    isAlive: true,
    hasWon: false,
    inventory: [],
    selectedChar: Chars.DEFAULT,
    size: 4,
    blackout: false,
    isHunterCell: false,
  },
};
