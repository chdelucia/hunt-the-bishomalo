import '@angular/compiler';
import { getTranslocoTestingModule } from './transloco-testing';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';

describe('transloco-testing', () => {
  it('should provide TranslocoTestingModule with default configuration', () => {
    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule()],
    });

    const service = TestBed.inject(TranslocoService);
    expect(service).toBeDefined();
    expect(service.getActiveLang()).toBe('en');
    expect(service.getAvailableLangs()).toEqual(['en', 'es']);
  });

  it('should allow overriding TranslocoTestingOptions', () => {
    TestBed.configureTestingModule({
      imports: [
        getTranslocoTestingModule({
          langs: { de: {} },
          translocoConfig: {
            availableLangs: ['de'],
            defaultLang: 'de',
          },
        }),
      ],
    });

    const service = TestBed.inject(TranslocoService);
    expect(service.getActiveLang()).toBe('de');
    expect(service.getAvailableLangs()).toEqual(['de']);
  });
});
