import { getTranslocoTestingModule } from './transloco-testing';

describe('TranslocoTesting', () => {
  it('should return a TranslocoTestingModule', () => {
    const module = getTranslocoTestingModule();
    expect(module).toBeDefined();
  });

  it('should allow overriding options', () => {
    const module = getTranslocoTestingModule({
      langs: {
        en: { test: 'test' },
      },
    });
    expect(module).toBeDefined();
  });
});
