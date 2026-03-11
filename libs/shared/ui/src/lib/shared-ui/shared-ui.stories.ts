import type { Meta, StoryObj } from '@storybook/angular';
import { SharedUi } from './shared-ui';
import { expect } from 'storybook/test';

const meta: Meta<SharedUi> = {
  component: SharedUi,
  title: 'SharedUi',
};
export default meta;

type Story = StoryObj<SharedUi>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/shared-ui/gi)).toBeTruthy();
  },
};
