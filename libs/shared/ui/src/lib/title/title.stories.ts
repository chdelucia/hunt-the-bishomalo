import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { TitleComponent } from './title.component';
import { TranslocoModule } from '@jsverse/transloco';

const meta: Meta<TitleComponent> = {
  title: 'Shared UI/Title',
  component: TitleComponent,
  decorators: [
    moduleMetadata({
      imports: [TranslocoModule],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<TitleComponent>;

export const Default: Story = {
  args: {
    blackout: false,
  },
};

export const Blackout: Story = {
  args: {
    blackout: true,
  },
};
