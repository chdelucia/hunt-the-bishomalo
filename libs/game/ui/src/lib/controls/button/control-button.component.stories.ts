import type { Meta, StoryObj } from '@storybook/angular';
import { ControlButtonComponent } from './control-button.component';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ASSETS_BASE_URL } from '@hunt-the-bishomalo/shared-data';

const meta: Meta<ControlButtonComponent> = {
  component: ControlButtonComponent,
  title: 'Atoms/ControlButton',
  tags: ['autodocs'],
  args: {
    clicked: fn(),
  },
};
export default meta;

type Story = StoryObj<ControlButtonComponent>;

export const IconOnly: Story = {
  args: {
    ariaLabel: 'Move Forward',
    iconUrl: `${ASSETS_BASE_URL}/go.svg`,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    await expect(meta.args?.clicked).toHaveBeenCalled();
  },
};

export const TextOnly: Story = {
  args: {
    ariaLabel: 'Sound Toggle',
    label: '🔊',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    await expect(meta.args?.clicked).toHaveBeenCalled();
  },
};

export const IconAndText: Story = {
  args: {
    ariaLabel: 'Shoot',
    iconUrl: `${ASSETS_BASE_URL}/shoot.svg`,
    label: 'SHOOT',
  },
};
