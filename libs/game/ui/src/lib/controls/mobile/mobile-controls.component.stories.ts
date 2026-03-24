import type { Meta, StoryObj } from '@storybook/angular';
import { MobileControlsComponent } from './mobile-controls.component';

const meta: Meta<MobileControlsComponent> = {
  component: MobileControlsComponent,
  title: 'Game/MobileControls',
  argTypes: {
    isFinish: { control: 'boolean' },
    soundEnabled: { control: 'boolean' },
    moveForwardRequested: { action: 'moveForward' },
    turnLeftRequested: { action: 'turnLeft' },
    turnRightRequested: { action: 'turnRight' },
    shootArrowRequested: { action: 'shootArrow' },
    toggleSoundRequested: { action: 'toggleSound' },
  },
};
export default meta;

type Story = StoryObj<MobileControlsComponent>;

export const Default: Story = {
  args: {
    isFinish: false,
    soundEnabled: true,
  },
};

export const GameFinished: Story = {
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
