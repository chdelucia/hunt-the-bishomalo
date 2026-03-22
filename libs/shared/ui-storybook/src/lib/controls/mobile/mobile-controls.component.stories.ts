import type { Meta, StoryObj } from '@storybook/angular';
import { MobileControlsComponent } from './mobile-controls.component';
import { fn } from '@storybook/test';

const meta: Meta<MobileControlsComponent> = {
  component: MobileControlsComponent,
  title: 'MobileControlsComponent',
};
export default meta;

type Story = StoryObj<MobileControlsComponent>;

export const MobileControls: Story = {
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
