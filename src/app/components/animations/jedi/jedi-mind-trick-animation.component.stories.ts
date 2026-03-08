import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { JediMindTrickAnimationComponent } from './jedi-mind-trick-animation.component';
import { AchievementService } from '@hunt-the-bishomalo/achievements';
import { RouterModule } from '@angular/router';

const meta: Meta<JediMindTrickAnimationComponent> = {
  title: 'Animations/JediMindTrick',
  component: JediMindTrickAnimationComponent,
  decorators: [
    moduleMetadata({
      imports: [RouterModule.forRoot([])],
      providers: [
        {
          provide: AchievementService,
          useValue: {
            activeAchievement: () => {},
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
