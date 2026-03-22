import type { Meta, StoryObj } from '@storybook/angular';
import { BlackoutComponent } from './blackout.component';

const meta: Meta<BlackoutComponent> = {
  component: BlackoutComponent,
  title: 'BlackoutComponent',
};
export default meta;

type Story = StoryObj<BlackoutComponent>;

export const Default: Story = {
  args: {},
};
