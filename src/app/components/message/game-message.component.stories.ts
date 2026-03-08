import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { GameMessageComponent } from './game-message.component';
import { TranslocoModule } from '@jsverse/transloco';
import { provideHttpClient } from '@angular/common/http';
import { TranslocoHttpLoader } from '../../utils/transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import { GameEngineService } from '@hunt-the-bishomalo/core/services';
import { Router } from '@angular/router';
import { Difficulty } from '@hunt-the-bishomalo/data';

const meta: Meta<GameMessageComponent> = {
  title: 'Components/GameMessage',
  component: GameMessageComponent,
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
        { provide: GameEngineService, useValue: { initGame: () => {} } },
        { provide: Router, useValue: { navigate: () => {} } },
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<GameMessageComponent>;

const mockSettings = (size: number) => ({
  size,
  difficulty: { maxLevels: 10 } as Difficulty,
  blackout: false,
  selectedChar: 'default',
});

export const WinMessage: Story = {
  args: {
    message: '¡Has ganado!',
    isAlive: true,
    hasWon: true,
    settings: mockSettings(4),
    lives: 3,
  },
};

export const DeathByWumpus: Story = {
  args: {
    message: 'Te ha comido el bishomalo',
    isAlive: false,
    hasWon: false,
    settings: mockSettings(4),
    lives: 0,
  },
};

export const PitMessage: Story = {
  args: {
    message: 'Has caído en un pozo',
    isAlive: false,
    hasWon: false,
    settings: mockSettings(4),
    lives: 0,
  },
};

export const NextLevelAvailable: Story = {
  args: {
    message: 'Has encontrado el portal',
    isAlive: true,
    hasWon: true,
    settings: mockSettings(4),
    lives: 3,
  },
};
