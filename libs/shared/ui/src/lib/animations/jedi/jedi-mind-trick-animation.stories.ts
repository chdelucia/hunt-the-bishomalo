import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { JediMindTrickAnimationComponent } from './jedi-mind-trick-animation.component';
import { AchievementService } from '@hunt-the-bishomalo/achievements';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

const meta: Meta<JediMindTrickAnimationComponent> = {
  title: 'Shared UI/Animations/Jedi Mind Trick',
  component: JediMindTrickAnimationComponent,
  decorators: [
    moduleMetadata({
      imports: [RouterModule.forRoot([])],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
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
type Story = StoryObj<JediMindTrickAnimationComponent>;

export const Default: Story = {};
