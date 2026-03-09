import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { AchievementFilterComponent } from './achievement-filter.component';
import { TranslocoModule } from '@jsverse/transloco';

const meta: Meta<AchievementFilterComponent> = {
  title: 'Shared UI/Achievements/Filter',
  component: AchievementFilterComponent,
  decorators: [
    moduleMetadata({
      imports: [TranslocoModule],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<AchievementFilterComponent>;

export const AllSelected: Story = {
  args: {
    currentFilter: 'all',
  },
};

export const UnlockedSelected: Story = {
  args: {
    currentFilter: 'unlocked',
  },
};

export const LockedSelected: Story = {
  args: {
    currentFilter: 'locked',
  },
};
