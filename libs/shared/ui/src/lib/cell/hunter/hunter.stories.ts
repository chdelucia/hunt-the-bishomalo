import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { HunterComponent } from './hunter.component';
import { TranslocoModule } from '@jsverse/transloco';
import { Direction } from '@hunt-the-bishomalo/data';

const meta: Meta<HunterComponent> = {
  title: 'Shared UI/Game Cell/Hunter',
  component: HunterComponent,
  decorators: [
    moduleMetadata({
      imports: [TranslocoModule],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<HunterComponent>;

export const Default: Story = {
  args: {
    direction: Direction.RIGHT,
    arrows: 3,
    selectedChar: 'default',
    hasGold: false,
    size: 8,
    hasLantern: false,
    hasShield: false,
  },
};

export const WithGold: Story = {
  args: {
    direction: Direction.RIGHT,
    arrows: 1,
    selectedChar: 'default',
    hasGold: true,
    size: 8,
    hasLantern: true,
    hasShield: true,
  },
};
