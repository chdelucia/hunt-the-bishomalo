import type { Meta, StoryObj } from '@storybook/angular';
import { AchievementItemComponent } from './achievement-item.component';

const meta: Meta<AchievementItemComponent> = {
  component: AchievementItemComponent,
  title: 'AchievementItemComponent',
};
export default meta;

type Story = StoryObj<AchievementItemComponent>;

export const Common: Story = {
  args: {
    achievement: {
      id: '1',
      title: 'Common Achievement',
      description: 'A common achievement description',
      rarity: 'common',
      unlocked: true,
      svgIcon: 'boardicons/gold.png'
    } as any
  },
};

export const Legendary: Story = {
  args: {
    achievement: {
      id: '2',
      title: 'Legendary Achievement',
      description: 'A legendary achievement description',
      rarity: 'legendary',
      unlocked: true,
      svgIcon: 'boardicons/wumpus.png'
    } as any
  },
};

export const Locked: Story = {
  args: {
    achievement: {
      id: '3',
      title: 'Locked Achievement',
      description: 'A locked achievement description',
      rarity: 'rare',
      unlocked: false,
      svgIcon: 'boardicons/pit.png'
    } as any
  },
};
