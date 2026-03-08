import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HunterComponent } from './hunter.component';
import { TranslocoModule } from '@jsverse/transloco';
import { provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from '../../../utils/transloco-loader';
import { Direction } from '@hunt-the-bishomalo/data';

describe('HunterComponent', () => {
  let component: HunterComponent;
  let fixture: ComponentFixture<HunterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HunterComponent, TranslocoModule],
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

    fixture = TestBed.createComponent(HunterComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('direction', Direction.RIGHT);
    fixture.componentRef.setInput('arrows', 3);
    fixture.componentRef.setInput('selectedChar', 'default');
    fixture.componentRef.setInput('hasGold', false);
    fixture.componentRef.setInput('size', 4);
    fixture.componentRef.setInput('hasLantern', false);
    fixture.componentRef.setInput('hasShield', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
