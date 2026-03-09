import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ToastComponent } from './toast.component';
import { AchievementService } from '@hunt-the-bishomalo/achievements';
import { of } from 'rxjs';
import { signal } from '@angular/core';

const meta: Meta<ToastComponent> = {
  title: 'Shared UI/Toast',
  component: ToastComponent,
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: AchievementService,
          useValue: {
            completed: signal(null),
          },
        },
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ToastComponent>;

export const Default: Story = {};
