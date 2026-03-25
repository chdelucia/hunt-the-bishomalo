import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import { Component } from '@angular/core';

@Component({
  template: '',
  standalone: true,
})
export class StoryDummyComponent {}

const meta: Meta<StoryDummyComponent> = {
  component: StoryDummyComponent,
  title: 'Atoms/Dummy',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<StoryDummyComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas).toBeTruthy();
  },
};
