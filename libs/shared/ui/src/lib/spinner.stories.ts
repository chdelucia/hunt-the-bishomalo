import type { Meta, StoryObj } from '@storybook/angular';
import { SpinnerComponent } from './spinner';

const meta: Meta<SpinnerComponent> = {
  component: SpinnerComponent,
  title: 'Shared/Spinner',
  argTypes: {
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'select' },
    },
    color: {
      control: { type: 'color' },
    },
  },
};
export default meta;

type Story = StoryObj<SpinnerComponent>;

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};

export const CustomColor: Story = {
  args: {
    size: 'medium',
    color: '#ff00ff',
  },
};
