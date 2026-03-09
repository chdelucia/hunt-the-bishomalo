import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { GameCellComponent } from './game-cell.component';
import { GameStore } from '@hunt-the-bishomalo/core/store';
import { TranslocoModule } from '@jsverse/transloco';
import { signal } from '@angular/core';

const meta: Meta<GameCellComponent> = {
  title: 'Shared UI/Game Cell',
  component: GameCellComponent,
  decorators: [
    moduleMetadata({
      imports: [TranslocoModule],
      providers: [
        {
          provide: GameStore,
          useValue: {
            settings: signal({ blackout: false, size: 8, selectedChar: 'default' }),
            inventory: signal([]),
            isAlive: signal(true),
            hasWon: signal(false),
            hasGold: signal(false),
            currentCell: signal(null),
            hunter: signal({ direction: 1 }),
            arrows: signal(3),
          },
        },
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<GameCellComponent>;

export const Default: Story = {
  args: {
    cell: {
      x: 0,
      y: 0,
      visited: false,
    },
  },
};
