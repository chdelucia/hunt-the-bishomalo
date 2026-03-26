import { TestBed } from '@angular/core/testing';
import { ConfigService, REMOTE_CONFIG_TOKEN, RemoteConfig } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;
  const mockConfig: RemoteConfig = {
    remotes: {
      mfe1: 'http://localhost:4201',
    },
  };

  describe('with config', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ConfigService,
          { provide: REMOTE_CONFIG_TOKEN, useValue: mockConfig },
        ],
      });
      service = TestBed.inject(ConfigService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should return remotes from config', () => {
      expect(service.remotes).toEqual(mockConfig.remotes);
    });
  });

  describe('without config', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ConfigService,
          { provide: REMOTE_CONFIG_TOKEN, useValue: null },
        ],
      });
      service = TestBed.inject(ConfigService);
    });

    it('should return empty remotes if config is missing', () => {
      expect(service.remotes).toEqual({});
    });
  });
});
