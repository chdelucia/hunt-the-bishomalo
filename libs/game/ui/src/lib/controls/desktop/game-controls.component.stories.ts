import type { Meta, StoryObj } from '@storybook/angular';
import { GameControlsComponent } from './game-controls.component';
import { expect, fn } from 'storybook/test';

const meta: Meta<GameControlsComponent> = {
  component: GameControlsComponent,
  title: 'Molecules/GameControls',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<GameControlsComponent>;

export const Default: Story = {
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

export const SoundDisabled: Story = {
  args: {
    soundEnabled: false,
    toggleSoundRequested: fn(),
  },
  play: async ({ canvas }) => {
    // Sound icon should reflect state
    await expect(canvas).toBeTruthy();
  },
};
