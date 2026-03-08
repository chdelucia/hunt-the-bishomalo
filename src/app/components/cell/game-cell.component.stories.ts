import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { GameCellComponent } from './game-cell.component';
import { TranslocoModule } from '@jsverse/transloco';
import { provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from '../../utils/transloco-loader';
import { GameStore } from '@hunt-the-bishomalo/core/store';
import { signal } from '@angular/core';
import { Direction } from '@hunt-the-bishomalo/data';

const meta: Meta<GameCellComponent> = {
  title: 'Game/GameCell',
  component: GameCellComponent,
  decorators: [
    moduleMetadata({
      imports: [TranslocoModule],
      providers: [
        provideHttpClient(),
        provideTransloco({
          config: {
            availableLangs: ['en', 'es'],
            defaultLang: 'es',
            reRenderOnLangChange: true,
            prodMode: false,
          },
          loader: TranslocoHttpLoader,
        }),
        {
          provide: GameStore,
          useValue: {
            settings: signal({ blackout: false, size: 4, selectedChar: 'default' }),
            inventory: signal([]),
            isAlive: signal(true),
            hasWon: signal(false),
            currentCell: signal(null),
            hunter: signal({ direction: Direction.RIGHT }),
            arrows: signal(3),
            hasGold: signal(false),
          },
        },
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<GameCellComponent>;

export const VisitedEmpty: Story = {
  args: {
    cell: {
      x: 0,
      y: 0,
      visited: true,
      content: null,
      sensoryMessages: [],
    },
  },
};

export const WithWumpus: Story = {
  args: {
    cell: {
      x: 1,
      y: 1,
      visited: true,
      content: { type: 'wumpus', image: 'assets/icons/wumpus.svg', alt: 'wumpus' },
      sensoryMessages: [],
    },
  },
};

export const Unvisited: Story = {
  args: {
    cell: {
      x: 2,
      y: 2,
      visited: false,
      content: null,
      sensoryMessages: [],
    },
  },
};
