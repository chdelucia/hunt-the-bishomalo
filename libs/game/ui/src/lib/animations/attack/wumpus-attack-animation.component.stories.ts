import type { Meta, StoryObj } from '@storybook/angular';
import { AppWumpusAttackAnimationComponent } from './wumpus-attack-animation.component';
import { expect } from 'storybook/test';

const meta: Meta<AppWumpusAttackAnimationComponent> = {
  component: AppWumpusAttackAnimationComponent,
  title: 'AppWumpusAttackAnimationComponent',
};
export default meta;

type Story = StoryObj<AppWumpusAttackAnimationComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/wumpus-attack-animation/gi)).toBeTruthy();
  },
};
