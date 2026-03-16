import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslocoHttpLoader } from './transloco-loader';

describe('TranslocoHttpLoader', () => {
  let loader: TranslocoHttpLoader;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TranslocoHttpLoader],
    });

    loader = TestBed.inject(TranslocoHttpLoader);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch translation file', () => {
    const lang = 'en';
    loader.getTranslation(lang).subscribe((data) => {
      expect(data).toEqual({ key: 'value' });
    });

    const req = httpMock.expectOne(`/assets/i18n/${lang}.json`);
    expect(req.request.method).toBe('GET');
    req.flush({ key: 'value' });
  });
});
