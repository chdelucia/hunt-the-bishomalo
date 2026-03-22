import type { Meta, StoryObj } from '@storybook/angular';
import { WumpusAttackAnimationComponent } from './wumpus-attack-animation.component';
import { fn } from '@storybook/test';

const meta: Meta<WumpusAttackAnimationComponent> = {
  component: WumpusAttackAnimationComponent,
  title: 'WumpusAttackAnimationComponent',
};
export default meta;

type Story = StoryObj<WumpusAttackAnimationComponent>;

export const Default: Story = {
  args: {
    selectedChar: 'kukuxu',
    closeAnimation: fn(),
  },
};
