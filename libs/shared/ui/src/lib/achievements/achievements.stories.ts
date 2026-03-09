import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { AchievementsComponent } from './achievements.component';
import { AchievementService } from '@hunt-the-bishomalo/achievements';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

const meta: Meta<AchievementsComponent> = {
  title: 'Shared UI/Achievements',
  component: AchievementsComponent,
  decorators: [
    moduleMetadata({
      imports: [TranslocoModule, RouterModule.forRoot([])],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        {
          provide: AchievementService,
          useValue: {
            achievements: [
              {
                id: '1',
                title: 'Primer paso',
                description: 'Empieza tu aventura',
                unlocked: true,
                rarity: 'common',
                svgIcon: 'assets/icons/achievements/first-step.svg',
              },
              {
                id: '2',
                title: 'Cazador novato',
                description: 'Caza tu primer bisho',
                unlocked: false,
                rarity: 'uncommon',
                svgIcon: 'assets/icons/achievements/hunter.svg',
              },
            ],
          },
        },
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<AchievementsComponent>;

export const Default: Story = {};
