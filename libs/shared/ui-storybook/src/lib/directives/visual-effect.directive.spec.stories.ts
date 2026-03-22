import type { Meta, StoryObj } from '@storybook/angular';
import { TestHostComponent } from './visual-effect.directive.spec';
import { expect } from 'storybook/test';

const meta: Meta<TestHostComponent> = {
  component: TestHostComponent,
  title: 'TestHostComponent',
};
export default meta;

type Story = StoryObj<TestHostComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/visual-effect.directive.spec/gi)).toBeTruthy();
  },
};
