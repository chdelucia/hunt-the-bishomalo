import type { Meta, StoryObj } from '@storybook/angular';
import { TitleComponent } from './title.component';
import { expect } from 'storybook/test';

const meta: Meta<TitleComponent> = {
  component: TitleComponent,
  title: 'Atoms/Title',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<TitleComponent>;

export const Default: Story = {
  args: {
    blackout: false,
  },
  play: async ({ canvas, step }) => {
    await step('Verify title is displayed', async () => {
      await expect(canvas.getByRole('heading')).toBeTruthy();
    });
  },
};

export const Blackout: Story = {
  args: {
    blackout: true,
  },
};
