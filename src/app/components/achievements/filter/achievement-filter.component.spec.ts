import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AchievementFilterComponent } from './achievement-filter.component';
import { TranslocoModule } from '@jsverse/transloco';
import { provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from '../../../utils/transloco-loader';

describe('AchievementFilterComponent', () => {
  let component: AchievementFilterComponent;
  let fixture: ComponentFixture<AchievementFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementFilterComponent, TranslocoModule],
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

    fixture = TestBed.createComponent(AchievementFilterComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('currentFilter', 'all');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
