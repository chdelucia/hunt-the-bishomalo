import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { BlackoutComponent } from './blackout.component';
import { GameSoundService } from '@hunt-the-bishomalo/core/services';
import { AchievementService } from '@hunt-the-bishomalo/achievements';
import { TranslocoModule } from '@jsverse/transloco';

const meta: Meta<BlackoutComponent> = {
  title: 'Shared UI/Blackout',
  component: BlackoutComponent,
  decorators: [
    moduleMetadata({
      imports: [TranslocoModule],
      providers: [
        {
          provide: GameSoundService,
          useValue: {
            playSound: jest.fn(),
          },
        },
        {
          provide: AchievementService,
          useValue: {
            activeAchievement: jest.fn(),
          },
        },
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<BlackoutComponent>;

export const Default: Story = {};
