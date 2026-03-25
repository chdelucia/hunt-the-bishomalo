import type { Meta, StoryObj } from '@storybook/angular';
import { MenuComponent } from './menu.component';
import { expect, fn, userEvent } from 'storybook/test';
import { provideRouter } from '@angular/router';
import { applicationConfig } from '@storybook/angular';

const meta: Meta<MenuComponent> = {
  component: MenuComponent,
  title: 'Organisms/Menu',
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideRouter([])],
    }),
  ],
};
export default meta;

type Story = StoryObj<MenuComponent>;

export const Default: Story = {
  args: {
    newGameRequested: fn(),
  },
};

export const Open: Story = {
  args: {
    newGameRequested: fn(),
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    // Menu should be open, check for some link text
    await expect(canvas.getByText(/settings/i)).toBeTruthy();
  },
};
