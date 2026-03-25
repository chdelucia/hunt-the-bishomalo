import type { Meta, StoryObj } from '@storybook/angular';
import { MenuComponent } from './menu.component';
import { expect } from 'storybook/test';

const meta: Meta<MenuComponent> = {
  component: MenuComponent,
  title: 'MenuComponent',
};
export default meta;

type Story = StoryObj<MenuComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/menu/gi)).toBeTruthy();
  },
};
