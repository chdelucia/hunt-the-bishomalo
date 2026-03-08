import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AchievementItemComponent } from './achievement-item.component';
import { TranslocoModule } from '@jsverse/transloco';
import { provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from '../../../utils/transloco-loader';

describe('AchievementItemComponent', () => {
  let component: AchievementItemComponent;
  let fixture: ComponentFixture<AchievementItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementItemComponent, TranslocoModule],
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
    }).compileComponents();

    fixture = TestBed.createComponent(AchievementItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('achievement', {
      id: 'test',
      title: 'Test Achievement',
      description: 'Test Description',
      rarity: 'common',
      unlocked: true,
      svgIcon: 'assets/icons/test.svg',
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
