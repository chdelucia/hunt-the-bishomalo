import type { Meta, StoryObj } from '@storybook/angular';
import { AppWumpusAttackAnimationComponent } from './wumpus-attack-animation.component';
import { expect, fn } from 'storybook/test';
import { Chars } from '@hunt-the-bishomalo/shared-data';

const meta: Meta<AppWumpusAttackAnimationComponent> = {
  component: AppWumpusAttackAnimationComponent,
  title: 'Organisms/WumpusAttackAnimation',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<AppWumpusAttackAnimationComponent>;

export const Default: Story = {
  args: {
    selectedChar: Chars.LINK,
    closeAnimation: fn(),
  },
};

export const Lara: Story = {
  args: {
    selectedChar: Chars.LARA,
    closeAnimation: fn(),
  },
  play: async ({ canvas }) => {
    // Should see something related to lara
    await expect(canvas).toBeTruthy();
  },
};
