import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { GameLevelComponent } from './game-level.component';
import { TranslocoModule } from '@jsverse/transloco';
import { Chars } from '@hunt-the-bishomalo/data';

const meta: Meta<GameLevelComponent> = {
  title: 'Shared UI/Game Level',
  component: GameLevelComponent,
  decorators: [
    moduleMetadata({
      imports: [TranslocoModule],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<GameLevelComponent>;

export const Level1: Story = {
  args: {
    settings: {
      size: 4,
      blackout: false,
      selectedChar: Chars.DEFAULT,
    } as any,
  },
};

export const Level5: Story = {
  args: {
    settings: {
      size: 8,
      blackout: false,
      selectedChar: Chars.DEFAULT,
    } as any,
  },
};
