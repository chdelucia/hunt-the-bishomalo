import type { Meta, StoryObj } from '@storybook/angular';
import { BlackoutComponent } from './blackout.component';
import { expect } from 'storybook/test';

const meta: Meta<BlackoutComponent> = {
  component: BlackoutComponent,
  title: 'Atoms/Blackout',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<BlackoutComponent>;

export const Primary: Story = {
  args: {},
};

export const Displayed: Story = {
  args: {},
  play: async ({ canvas }) => {
    // Blackout usually contains some text from transloco, like "It's too dark..."
    await expect(canvas).toBeTruthy();
  },
};
