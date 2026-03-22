import type { Meta, StoryObj } from '@storybook/angular';
import { GameControlsComponent } from './game-controls.component';
import { fn } from '@storybook/test';

const meta: Meta<GameControlsComponent> = {
  component: GameControlsComponent,
  title: 'GameControlsComponent',
};
export default meta;

type Story = StoryObj<GameControlsComponent>;

export const DesktopControls: Story = {
  args: {
    soundEnabled: true,
    newGameRequested: fn(),
    navigateToControlsRequested: fn(),
    moveForwardRequested: fn(),
    turnLeftRequested: fn(),
    turnRightRequested: fn(),
    shootArrowRequested: fn(),
    resetGameRequested: fn(),
    toggleSoundRequested: fn(),
  },
};
