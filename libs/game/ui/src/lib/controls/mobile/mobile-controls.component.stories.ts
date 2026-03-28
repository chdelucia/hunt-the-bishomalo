import type { Meta, StoryObj } from '@storybook/angular';
import { MobileControlsComponent } from './mobile-controls.component';
import { expect, fn, userEvent, within } from 'storybook/test';

const meta: Meta<MobileControlsComponent> = {
  component: MobileControlsComponent,
  title: 'Molecules/MobileControls',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<MobileControlsComponent>;

export const Default: Story = {
  args: {
    isFinish: false,
    soundEnabled: true,
    moveForwardRequested: fn(),
    turnLeftRequested: fn(),
    turnRightRequested: fn(),
    shootArrowRequested: fn(),
    toggleSoundRequested: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const forwardBtn = canvas.getByRole('button', { name: /forward/i });
    const leftBtn = canvas.getByRole('button', { name: /left/i });
    const rightBtn = canvas.getByRole('button', { name: /right/i });
    const shootBtn = canvas.getByRole('button', { name: /shoot/i });
    const soundBtn = canvas.getByRole('button', { name: /sound/i });

    await userEvent.click(forwardBtn);
    await expect(args.moveForwardRequested).toHaveBeenCalled();

    await userEvent.click(leftBtn);
    await expect(args.turnLeftRequested).toHaveBeenCalled();

    await userEvent.click(rightBtn);
    await expect(args.turnRightRequested).toHaveBeenCalled();

    await userEvent.click(shootBtn);
    await expect(args.shootArrowRequested).toHaveBeenCalled();

    await userEvent.click(soundBtn);
    await expect(args.toggleSoundRequested).toHaveBeenCalled();
  },
};

export const FinishedGame: Story = {
  args: {
    isFinish: true,
    soundEnabled: true,
  },
};

export const SoundDisabled: Story = {
  args: {
    isFinish: false,
    soundEnabled: false,
  },
};
