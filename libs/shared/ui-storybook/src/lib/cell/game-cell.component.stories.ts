import type { Meta, StoryObj } from '@storybook/angular';
import { GameCellComponent } from './game-cell.component';
import { Chars } from '@hunt-the-bishomalo/data';

const meta: Meta<GameCellComponent> = {
  component: GameCellComponent,
  title: 'GameCellComponent',
};
export default meta;

type Story = StoryObj<GameCellComponent>;

const baseCell = {
  x: 0,
  y: 0,
  visited: true,
  content: null,
};

export const Empty: Story = {
  args: {
    cell: baseCell as any,
    isAlive: true,
    hasWon: false,
    selectedChar: Chars.KUKUXU,
    size: 5,
    blackout: false,
    isHunterCell: false,
  },
};

export const WithHunter: Story = {
  args: {
    cell: baseCell as any,
    isAlive: true,
    hasWon: false,
    selectedChar: Chars.KUKUXU,
    size: 5,
    blackout: false,
    isHunterCell: true,
    hunter: { x: 0, y: 0, direction: 'up', hasGold: false } as any
  },
};

export const WithGold: Story = {
  args: {
    cell: { ...baseCell, content: { type: 'gold', alt: 'gold' } } as any,
    isAlive: true,
    hasWon: false,
    selectedChar: Chars.KUKUXU,
    size: 5,
    blackout: false,
    isHunterCell: false,
  },
};

export const WithWumpus: Story = {
  args: {
    cell: { ...baseCell, content: { type: 'wumpus', alt: 'wumpus' } } as any,
    isAlive: false,
    hasWon: false,
    selectedChar: Chars.KUKUXU,
    size: 5,
    blackout: false,
    isHunterCell: false,
  },
};

export const Blackout: Story = {
  args: {
    cell: baseCell as any,
    isAlive: true,
    hasWon: false,
    selectedChar: Chars.KUKUXU,
    size: 5,
    blackout: true,
    isHunterCell: false,
  },
};
