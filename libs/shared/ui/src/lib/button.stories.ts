import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button';

const meta: Meta<ButtonComponent> = {
  component: ButtonComponent,
  title: 'Shared/Button',
  argTypes: {
    variant: {
      options: ['primary', 'secondary', 'danger'],
      control: { type: 'select' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    clicked: { action: 'clicked' },
  },
};
export default meta;

type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `<lib-button [variant]="variant" [disabled]="disabled" (clicked)="clicked()">Primary Button</lib-button>`,
  }),
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
  render: (args) => ({
    props: args,
    template: `<lib-button [variant]="variant" [disabled]="disabled" (clicked)="clicked()">Secondary Button</lib-button>`,
  }),
};

export const Danger: Story = {
  args: {
    variant: 'danger',
  },
  render: (args) => ({
    props: args,
    template: `<lib-button [variant]="variant" [disabled]="disabled" (clicked)="clicked()">Danger Button</lib-button>`,
  }),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => ({
    props: args,
    template: `<lib-button [variant]="variant" [disabled]="disabled" (clicked)="clicked()">Disabled Button</lib-button>`,
  }),
};
