import type { Meta, StoryObj } from '@storybook/angular';
import { BadgeComponent } from './badge';

const meta: Meta<BadgeComponent> = {
  component: BadgeComponent,
  title: 'Shared/Badge',
  argTypes: {
    variant: {
      options: ['common', 'rare', 'epic', 'legendary'],
      control: { type: 'select' },
    },
    label: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<BadgeComponent>;

export const Common: Story = {
  args: {
    variant: 'common',
    label: 'Common',
  },
};

export const Rare: Story = {
  args: {
    variant: 'rare',
    label: 'Rare',
  },
};

export const Epic: Story = {
  args: {
    variant: 'epic',
    label: 'Epic',
  },
};

export const Legendary: Story = {
  args: {
    variant: 'legendary',
    label: 'Legendary',
  },
};

export const CustomContent: Story = {
  args: {
    variant: 'rare',
  },
  render: (args) => ({
    props: args,
    template: `<lib-badge [variant]="variant">★ New ★</lib-badge>`,
  }),
};
