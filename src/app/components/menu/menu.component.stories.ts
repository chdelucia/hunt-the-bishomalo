import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MenuComponent } from './menu.component';
import { TranslocoModule } from '@jsverse/transloco';
import { provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from '../../utils/transloco-loader';
import { GameEngineService } from '@hunt-the-bishomalo/core/services';
import { Router, RouterModule } from '@angular/router';

const meta: Meta<MenuComponent> = {
  title: 'Navigation/Menu',
  component: MenuComponent,
  decorators: [
    moduleMetadata({
      imports: [TranslocoModule, RouterModule.forRoot([])],
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
        { provide: GameEngineService, useValue: { newGame: () => {} } },
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<MenuComponent>;

export const Closed: Story = {};

export const Open: Story = {};
