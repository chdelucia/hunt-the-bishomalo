import type { Meta, StoryObj } from '@storybook/angular';
import { MobileControlsComponent } from './mobile-controls.component';
import { expect, fn } from 'storybook/test';

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
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /forward/i })).toBeTruthy();
    await expect(canvas.getByRole('button', { name: /left/i })).toBeTruthy();
    await expect(canvas.getByRole('button', { name: /right/i })).toBeTruthy();
    await expect(canvas.getByRole('button', { name: /shoot/i })).toBeTruthy();
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
