import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { GameLevelComponent } from './game-level.component';
import { TranslocoModule } from '@jsverse/transloco';
import { provideHttpClient } from '@angular/common/http';
import { TranslocoHttpLoader } from '../../utils/transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import { Difficulty } from '@hunt-the-bishomalo/data';

const meta: Meta<GameLevelComponent> = {
  title: 'Components/GameLevel',
  component: GameLevelComponent,
  decorators: [
    moduleMetadata({
      imports: [TranslocoModule],
      providers: [
        provideHttpClient(),
        provideTransloco({
          config: {
            availableLangs: ['en', 'es'],
            defaultLang: 'es',
            reRenderOnLangChange: true,
            prodMode: false,
          },
          loader: TranslocoHttpLoader,
        }),
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<GameLevelComponent>;

const mockSettings = (size: number) => ({
  size,
  difficulty: { maxLevels: 10 } as Difficulty,
  blackout: false,
  selectedChar: 'default',
});

export const Level1: Story = {
  args: {
    settings: mockSettings(4),
  },
};

export const Level5: Story = {
  args: {
    settings: mockSettings(8),
  },
};

export const MaxLevel: Story = {
  args: {
    settings: mockSettings(13),
  },
};
