import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MobileControlsComponent } from './mobile-controls.component';
import { TranslocoModule } from '@jsverse/transloco';
import { provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from '../../../utils/transloco-loader';
import { GameEngineService } from '@hunt-the-bishomalo/core/services';
import { AchievementService } from '@hunt-the-bishomalo/achievements';

const meta: Meta<MobileControlsComponent> = {
  title: 'Game/MobileControls',
  component: MobileControlsComponent,
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
            turnRight: () => {},
            shootArrow: () => {},
          },
        },
        { provide: AchievementService, useValue: { activeAchievement: () => {} } },
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<MobileControlsComponent>;

export const InGame: Story = {
  args: {
    isFinish: false,
  },
};

export const GameFinished: Story = {
  args: {
    isFinish: true,
  },
};
