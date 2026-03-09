import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { GameMessageComponent } from './game-message.component';
import { GameEngineService } from '@hunt-the-bishomalo/core/services';
import { Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

const meta: Meta<GameMessageComponent> = {
  title: 'Shared UI/Game Message',
  component: GameMessageComponent,
  decorators: [
    moduleMetadata({
      imports: [TranslocoModule],
      providers: [
        {
          provide: GameEngineService,
          useValue: {
            initGame: jest.fn(),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn(),
          },
        },
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<GameMessageComponent>;

export const InfoMessage: Story = {
  args: {
    message: 'Sientes una brisa',
    isAlive: true,
    hasWon: false,
    settings: { size: 8, difficulty: { maxLevels: 10 } } as any,
    lives: 3,
  },
};

export const GameOver: Story = {
  args: {
    message: '¡Has caído en un pozo!',
    isAlive: false,
    hasWon: false,
    settings: { size: 8, difficulty: { maxLevels: 10 } } as any,
    lives: 0,
  },
};

export const LevelWon: Story = {
  args: {
    message: '¡Has derrotado al Bisho Malo!',
    isAlive: true,
    hasWon: true,
    settings: { size: 8, difficulty: { maxLevels: 10 } } as any,
    lives: 3,
  },
};
