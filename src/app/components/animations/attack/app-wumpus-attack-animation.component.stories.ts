import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { AppWumpusAttackAnimationComponent } from './app-wumpus-attack-animation.component';
import { GameStore } from '@hunt-the-bishomalo/core/store';
import { signal } from '@angular/core';

const meta: Meta<AppWumpusAttackAnimationComponent> = {
  title: 'Animations/WumpusAttack',
  component: AppWumpusAttackAnimationComponent,
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: GameStore,
          useValue: {
            settings: signal({ selectedChar: 'default' }),
          },
        },
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<AppWumpusAttackAnimationComponent>;

export const Default: Story = {};
