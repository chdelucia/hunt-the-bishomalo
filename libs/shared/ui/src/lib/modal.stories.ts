import type { Meta, StoryObj } from '@storybook/angular';
import { ModalComponent } from './modal';

const meta: Meta<ModalComponent> = {
  component: ModalComponent,
  title: 'Shared/Modal',
  argTypes: {
    isOpen: { control: 'boolean' },
    title: { control: 'text' },
    closeOnBackdrop: { control: 'boolean' },
    closeRequested: { action: 'closeRequested' },
  },
};
export default meta;

type Story = StoryObj<ModalComponent>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: 'Mission Briefing',
    closeOnBackdrop: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-modal [isOpen]="isOpen" [title]="title" [closeOnBackdrop]="closeOnBackdrop" (closeRequested)="closeRequested()">
        <p>Your objective is to find the gold and escape the cavern without falling into pits or being eaten by the Wumpus.</p>
        <div modal-footer>
          <button (click)="isOpen = false" style="font-family: 'Press Start 2P'; background: var(--color-green-700); color: white; border: none; padding: 12px;">Understood</button>
        </div>
      </lib-modal>
    `,
  }),
};
