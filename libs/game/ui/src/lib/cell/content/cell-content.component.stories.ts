import type { Meta, StoryObj } from '@storybook/angular';
import { CellContentComponent } from './cell-content.component';
import { expect } from 'storybook/test';

const meta: Meta<CellContentComponent> = {
  component: CellContentComponent,
  title: 'CellContentComponent',
};
export default meta;

type Story = StoryObj<CellContentComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/cell-content/gi)).toBeTruthy();
  },
};
