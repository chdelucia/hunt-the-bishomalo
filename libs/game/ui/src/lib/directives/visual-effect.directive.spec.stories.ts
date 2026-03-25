import type { Meta, StoryObj } from '@storybook/angular';
import { TestHostComponent } from './visual-effect.directive.spec';
import { expect } from 'storybook/test';

const meta: Meta<TestHostComponent> = {
  component: TestHostComponent,
  title: 'Directives/VisualEffect',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<TestHostComponent>;

export const Breeze: Story = {
  args: {
    effect: 'brisa',
  },
  play: async ({ canvas }) => {
    // Check for cloud elements which are added by the directive
    // We might need a small delay because requestAnimationFrame is used
    await new Promise(resolve => setTimeout(resolve, 50));
    await expect(canvas).toBeTruthy();
  },
};

export const Stench: Story = {
  args: {
    effect: 'hedor',
  },
};

export const Shine: Story = {
  args: {
    effect: 'brillo',
  },
};

export const Combined: Story = {
  args: {
    effect: 'brisa hedor brillo',
  },
};
