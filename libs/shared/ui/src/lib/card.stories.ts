import type { Meta, StoryObj } from '@storybook/angular';
import { CardComponent } from './card';

const meta: Meta<CardComponent> = {
  component: CardComponent,
  title: 'Shared/Card',
  argTypes: {
    title: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<CardComponent>;

export const Default: Story = {
  args: {
    title: 'Game Stats',
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-card [title]="title">
        <p>This is the main content of the card. It uses the retro theme and looks like a classic game panel.</p>
        <div card-footer>
          <button style="font-family: 'Press Start 2P'; background: var(--color-blue-600); color: white; border: none; padding: 8px;">Action</button>
        </div>
      </lib-card>
    `,
  }),
};

export const NoTitle: Story = {
  args: {
    title: '',
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-card>
        <p>This card has no header title. It just shows the content.</p>
      </lib-card>
    `,
  }),
};
