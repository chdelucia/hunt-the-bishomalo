import type { Meta, StoryObj } from '@storybook/angular';
import { MobileControlsComponent } from './mobile-controls.component';
import { fn } from 'storybook/test';

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
};

export const FinishedGame: Story = {
  args: {
    isFinish: true,
    soundEnabled: true,
  },
};
