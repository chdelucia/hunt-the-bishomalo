import type { Meta, StoryObj } from '@storybook/angular';
import { DummyComponent } from './menu.component.spec';
import { expect } from 'storybook/test';

const meta: Meta<DummyComponent> = {
  component: DummyComponent,
  title: 'Atoms/Dummy',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<DummyComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas).toBeTruthy();
  },
};
