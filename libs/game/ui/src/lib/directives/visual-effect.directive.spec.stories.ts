import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import { Component } from '@angular/core';
import { VisualEffectDirective } from './visual-effect.directive';

@Component({
  template: `<div [libVisualEffect]="effect"></div>`,
  standalone: true,
  imports: [VisualEffectDirective],
})
export class StoryHostComponent {
  effect = '';
}

const meta: Meta<StoryHostComponent> = {
  component: StoryHostComponent,
  title: 'Directives/VisualEffect',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<StoryHostComponent>;

export const Breeze: Story = {
  args: {
    effect: 'brisa',
  },
  play: async ({ canvas }) => {
    // Check for cloud elements which are added by the directive
    // We might need a small delay because requestAnimationFrame is used
    await new Promise(resolve => setTimeout(resolve, 50));
    await expect(canvas).toBeTruthy();
  },
};

export const Stench: Story = {
  args: {
    effect: 'hedor',
  },
};

export const Shine: Story = {
  args: {
    effect: 'brillo',
  },
};

export const Combined: Story = {
  args: {
    effect: 'brisa hedor brillo',
  },
};

export const BreezeAndStench: Story = {
  args: {
    effect: 'brisa hedor',
  },
};
