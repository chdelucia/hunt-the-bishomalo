import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MobileControlsComponent } from './mobile-controls.component';
import { GameEngineService } from '@hunt-the-bishomalo/core/services';
import { AchievementService } from '@hunt-the-bishomalo/achievements';
import { TranslocoModule } from '@jsverse/transloco';

const meta: Meta<MobileControlsComponent> = {
  title: 'Shared UI/Game Controls/Mobile',
  component: MobileControlsComponent,
  decorators: [
    moduleMetadata({
      imports: [TranslocoModule],
      providers: [
        {
          provide: GameEngineService,
          useValue: {
            moveForward: jest.fn(),
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
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<MobileControlsComponent>;

export const Default: Story = {
  args: {
    isFinish: false,
  },
};

export const GameFinished: Story = {
  args: {
    isFinish: true,
  },
};
