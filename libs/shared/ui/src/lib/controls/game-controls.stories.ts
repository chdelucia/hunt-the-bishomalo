import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { GameControlsComponent } from './game-controls.component';
import { GameEngineService } from '@hunt-the-bishomalo/core/services';
import { AchievementService } from '@hunt-the-bishomalo/achievements';
import { Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

const meta: Meta<GameControlsComponent> = {
  title: 'Shared UI/Game Controls',
  component: GameControlsComponent,
  decorators: [
    moduleMetadata({
      imports: [TranslocoModule],
      providers: [
        {
          provide: GameEngineService,
          useValue: {
            newGame: jest.fn(),
            initGame: jest.fn(),
            moveForward: jest.fn(),
            turnLeft: jest.fn(),
            turnRight: jest.fn(),
            shootArrow: jest.fn(),
          },
        },
        {
          provide: AchievementService,
          useValue: {
            activeAchievement: jest.fn(),
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
type Story = StoryObj<GameControlsComponent>;

export const Default: Story = {};
