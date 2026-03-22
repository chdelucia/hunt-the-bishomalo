import type { Meta, StoryObj } from '@storybook/angular';
import { TitleComponent } from './title.component';

const meta: Meta<TitleComponent> = {
  component: TitleComponent,
  title: 'TitleComponent',
};
export default meta;

type Story = StoryObj<TitleComponent>;

export const Default: Story = {
  args: {
    blackout: false,
  },
};

export const Blackout: Story = {
  args: {
    blackout: true,
  },
};
