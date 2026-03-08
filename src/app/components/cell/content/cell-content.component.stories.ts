import { Meta, StoryObj } from '@storybook/angular';
import { CellContentComponent } from './cell-content.component';

const meta: Meta<CellContentComponent> = {
  title: 'Game/CellContent',
  component: CellContentComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<CellContentComponent>;

export const Wumpus: Story = {
  args: {
    content: {
      type: 'wumpus',
      image: 'assets/icons/wumpus.svg',
      alt: 'wumpus',
    },
  },
};

export const Gold: Story = {
  args: {
    content: {
      type: 'gold',
      image: 'assets/icons/gold.svg',
      alt: 'gold',
    },
  },
};

export const Pit: Story = {
  args: {
    content: {
      type: 'pit',
      image: 'assets/icons/pit.svg',
      alt: 'pit',
    },
  },
};
