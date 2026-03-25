import type { Meta, StoryObj } from '@storybook/angular';
import { ToastComponent } from './toast.component';
import { expect } from 'storybook/test';

const meta: Meta<ToastComponent> = {
  component: ToastComponent,
  title: 'ToastComponent',
};
export default meta;

type Story = StoryObj<ToastComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/toast/gi)).toBeTruthy();
  },
};
