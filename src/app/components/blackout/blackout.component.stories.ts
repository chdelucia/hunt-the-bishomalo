import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { BlackoutComponent } from './blackout.component';
import { TranslocoModule } from '@jsverse/transloco';
import { provideHttpClient } from '@angular/common/http';
import { TranslocoHttpLoader } from '../../utils/transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import { GameSoundService } from '@hunt-the-bishomalo/core/services';
import { AchievementService } from '@hunt-the-bishomalo/achievements';

const meta: Meta<BlackoutComponent> = {
  title: 'Components/Blackout',
  component: BlackoutComponent,
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
        { provide: GameSoundService, useValue: { playSound: () => {} } },
        { provide: AchievementService, useValue: { activeAchievement: () => {} } },
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<BlackoutComponent>;

export const Default: Story = {};
