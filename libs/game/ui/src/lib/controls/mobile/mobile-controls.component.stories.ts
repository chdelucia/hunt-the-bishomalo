import type { Meta, StoryObj } from '@storybook/angular';
import { MobileControlsComponent } from './mobile-controls.component';
import { expect } from 'storybook/test';

const meta: Meta<MobileControlsComponent> = {
  component: MobileControlsComponent,
  title: 'MobileControlsComponent',
};
export default meta;

type Story = StoryObj<MobileControlsComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/mobile-controls/gi)).toBeTruthy();
  },
};
