import type { Meta, StoryObj } from '@storybook/angular';
import { BlackoutComponent } from './blackout.component';
import { expect } from 'storybook/test';

const meta: Meta<BlackoutComponent> = {
  component: BlackoutComponent,
  title: 'BlackoutComponent',
};
export default meta;

type Story = StoryObj<BlackoutComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/blackout/gi)).toBeTruthy();
  },
};
