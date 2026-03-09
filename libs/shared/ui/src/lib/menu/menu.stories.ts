import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MenuComponent } from './menu.component';
import { GameEngineService } from '@hunt-the-bishomalo/core/services';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { APP_BASE_HREF } from '@angular/common';

const meta: Meta<MenuComponent> = {
  title: 'Shared UI/Menu',
  component: MenuComponent,
  decorators: [
    moduleMetadata({
      imports: [TranslocoModule, RouterModule.forRoot([])],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        {
          provide: GameEngineService,
          useValue: {
            newGame: jest.fn(),
          },
        },
        {
          provide: Router,
          useValue: {
            navigateByUrl: jest.fn(),
          },
        },
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<MenuComponent>;

export const Default: Story = {};
