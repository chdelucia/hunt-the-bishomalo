import type { Meta, StoryObj } from '@storybook/angular';
import { TitleComponent } from './title.component';
import { expect } from 'storybook/test';

const meta: Meta<TitleComponent> = {
  component: TitleComponent,
  title: 'TitleComponent',
};
export default meta;

type Story = StoryObj<TitleComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/title/gi)).toBeTruthy();
  },
};
