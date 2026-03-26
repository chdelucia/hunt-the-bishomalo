import { fetchRemoteConfig, buildMergedManifest } from './config-loader';

describe('config-loader', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
  });

  describe('fetchRemoteConfig', () => {
    it('should fetch dev config when isDev is true', async () => {
      const mockConfig = { remotes: { mfe1: 'url1' } };
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockConfig),
      });

      const config = await fetchRemoteConfig(true);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://bold-mouse-42af.c-heredia-naranjo.workers.dev/mfe-remotes.dev.json'
      );
      expect(config).toEqual(mockConfig);
    });

    it('should fetch prod config when isDev is false', async () => {
      const mockConfig = { remotes: { mfe1: 'url1' } };
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockConfig),
      });

      const config = await fetchRemoteConfig(false);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://bold-mouse-42af.c-heredia-naranjo.workers.dev/mfe-remotes.prod.json'
      );
      expect(config).toEqual(mockConfig);
    });

    it('should use localStorage override if available', async () => {
      const mockOverride = { remotes: { override: 'local' } };
      localStorage.setItem('MFE_REMOTES_OVERRIDE', JSON.stringify(mockOverride));
      global.fetch = jest.fn();

      const config = await fetchRemoteConfig(true);

      expect(config).toEqual(mockOverride);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should warn and continue if localStorage override is invalid', async () => {
      localStorage.setItem('MFE_REMOTES_OVERRIDE', 'invalid json');
      const mockConfig = { remotes: { mfe1: 'url1' } };
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockConfig),
      });
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const config = await fetchRemoteConfig(true);

      expect(consoleSpy).toHaveBeenCalled();
      expect(config).toEqual(mockConfig);
    });

    it('should return empty remotes on fetch failure', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const config = await fetchRemoteConfig(true);

      expect(consoleSpy).toHaveBeenCalled();
      expect(config).toEqual({ remotes: {} });
    });
  });

  describe('buildMergedManifest', () => {
    it('should merge local manifest with cdn remotes', async () => {
      const localManifest = { shared: 'v1' };
      const cdnRemotes = { mfe1: 'url1' };
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(localManifest),
      });

      const result = await buildMergedManifest(cdnRemotes);

      expect(global.fetch).toHaveBeenCalledWith('federation.manifest.json');
      expect(result).toEqual({ ...localManifest, ...cdnRemotes });
    });

    it('should return only cdn remotes if local manifest fails to load', async () => {
      const cdnRemotes = { mfe1: 'url1' };
      global.fetch = jest.fn().mockRejectedValue(new Error('Fetch error'));
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = await buildMergedManifest(cdnRemotes);

      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toEqual(cdnRemotes);
    });
  });
});
