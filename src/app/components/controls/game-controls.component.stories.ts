import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { GameControlsComponent } from './game-controls.component';
import { TranslocoModule } from '@jsverse/transloco';
import { provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from '../../utils/transloco-loader';
import { GameEngineService } from '@hunt-the-bishomalo/core/services';
import { AchievementService } from '@hunt-the-bishomalo/achievements';
import { Router } from '@angular/router';

const meta: Meta<GameControlsComponent> = {
  title: 'Game/GameControls',
  component: GameControlsComponent,
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
        {
          provide: GameEngineService,
          useValue: {
            moveForward: () => {},
            turnLeft: () => {},
            turnRight: () => {},
            shootArrow: () => {},
            newGame: () => {},
            initGame: () => {},
          },
        },
        { provide: AchievementService, useValue: { activeAchievement: () => {} } },
        { provide: Router, useValue: { navigate: () => {} } },
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<GameControlsComponent>;

export const Default: Story = {};
