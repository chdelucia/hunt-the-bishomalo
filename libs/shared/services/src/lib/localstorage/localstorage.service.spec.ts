import { TestBed } from '@angular/core/testing';
import { LocalstorageService } from './localstorage.service';

describe('LocalstorageService', () => {
  let service: LocalstorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalstorageService);
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('getValue', () => {
    it('should return parsed value when JSON is valid', () => {
      const value = { name: 'Mario' };
      localStorage.setItem('test-key', JSON.stringify(value));

      const result = service.getValue('test-key');
      expect(result).toEqual(value);
    });

    it('should return null if key does not exist', () => {
      const result = service.getValue('non-existent');
      expect(result).toBeNull();
    });

    it('should return null if JSON is invalid', () => {
      localStorage.setItem('bad-json', 'not-json');

      const consoleSpy = jest.spyOn(console, 'log');
      const result = service.getValue('bad-json');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('setValue', () => {
    it('should store a value as JSON string', () => {
      const value = { score: 100 };
      service.setValue('game-score', value);

      const stored = localStorage.getItem('game-score');
      expect(stored).toEqual(JSON.stringify(value));
    });
  });

  describe('clearValue', () => {
    it('should remove a specific item from localStorage', () => {
      localStorage.setItem('temp', '123');
      service.clearValue('temp');

      expect(localStorage.getItem('temp')).toBeNull();
    });
  });

  describe('clearAll', () => {
    it('should clear all localStorage items', () => {
      localStorage.setItem('a', '1');
      localStorage.setItem('b', '2');

      service.clearAll();

      expect(localStorage.getItem('a')).toBeNull();
      expect(localStorage.getItem('b')).toBeNull();
    });
  });
});
