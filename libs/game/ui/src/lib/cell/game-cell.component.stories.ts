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
