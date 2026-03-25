import type { Meta, StoryObj } from '@storybook/angular';
import { HunterComponent } from './hunter.component';
import { expect } from 'storybook/test';
import { Direction } from '@hunt-the-bishomalo/shared-data';

const meta: Meta<HunterComponent> = {
  component: HunterComponent,
  title: 'Molecules/Hunter',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<HunterComponent>;

export const Default: Story = {
  args: {
    direction: Direction.RIGHT,
    arrows: 3,
    selectedChar: 'default',
    hasGold: false,
    size: 4,
    hasLantern: false,
    hasShield: false,
  },
};

export const WithGold: Story = {
  args: {
    direction: Direction.DOWN,
    arrows: 1,
    selectedChar: 'link',
    hasGold: true,
    size: 4,
    hasLantern: true,
    hasShield: true,
  },
};

export const LargeGrid: Story = {
  args: {
    direction: Direction.LEFT,
    arrows: 0,
    selectedChar: 'lara',
    hasGold: true,
    size: 15,
    hasLantern: false,
    hasShield: false,
  },
  play: async ({ canvas }) => {
    // Large grid, hasGold: true, size 15. gold icon shouldn't be visible
    await expect(canvas.queryByAltText(/gold/i)).toBeNull();
  },
};
