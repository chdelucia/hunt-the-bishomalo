import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AchievementProgressComponent } from './achievement-progress.component';
import { TranslocoModule } from '@jsverse/transloco';
import { provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from '../../../utils/transloco-loader';

describe('AchievementProgressComponent', () => {
  let component: AchievementProgressComponent;
  let fixture: ComponentFixture<AchievementProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementProgressComponent, TranslocoModule],
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

    fixture = TestBed.createComponent(AchievementProgressComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('unlockedCount', 5);
    fixture.componentRef.setInput('totalCount', 10);
    fixture.componentRef.setInput('percentage', 50);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
