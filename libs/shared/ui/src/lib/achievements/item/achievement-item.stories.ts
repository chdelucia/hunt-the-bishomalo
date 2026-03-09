import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { AchievementItemComponent } from './achievement-item.component';
import { TranslocoModule } from '@jsverse/transloco';

const meta: Meta<AchievementItemComponent> = {
  title: 'Shared UI/Achievements/Item',
  component: AchievementItemComponent,
  decorators: [
    moduleMetadata({
      imports: [TranslocoModule],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<AchievementItemComponent>;

export const Unlocked: Story = {
  args: {
    achievement: {
      id: '1',
      title: 'Primer paso',
      description: 'Empieza tu aventura',
      unlocked: true,
      rarity: 'common',
      svgIcon: 'assets/icons/achievements/first-step.svg',
    },
  },
};

export const Locked: Story = {
  args: {
    achievement: {
      id: '2',
      title: 'Mago supremo',
      description: 'Usa la magia por primera vez',
      unlocked: false,
      rarity: 'epic',
      svgIcon: 'assets/icons/achievements/magic.svg',
    },
  },
};
