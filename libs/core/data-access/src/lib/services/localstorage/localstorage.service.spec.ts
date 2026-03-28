import { TestBed } from '@angular/core/testing';
import { LocalstorageService } from './localstorage.service';
import { isDevMode } from '@angular/core';

jest.mock('@angular/core', () => ({
  ...jest.requireActual('@angular/core'),
  isDevMode: jest.fn(),
}));

describe('LocalstorageService', () => {
  let service: LocalstorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalstorageService);
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getValue', () => {
    it('should return null if key does not exist', () => {
      expect(service.getValue('non-existent')).toBeNull();
    });

    it('should return parsed value if key exists', () => {
      const data = { foo: 'bar' };
      localStorage.setItem('test-key', JSON.stringify(data));
      expect(service.getValue('test-key')).toEqual(data);
    });

    it('should return null and log error if parsing fails in dev mode', () => {
      (isDevMode as jest.Mock).mockReturnValue(true);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      localStorage.setItem('test-key', 'invalid-json');
      expect(service.getValue('test-key')).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should return null and NOT log error if parsing fails in production mode', () => {
      (isDevMode as jest.Mock).mockReturnValue(false);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      localStorage.setItem('test-key', 'invalid-json');
      expect(service.getValue('test-key')).toBeNull();
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('setValue', () => {
    it('should store stringified value in localStorage', () => {
      const data = { key: 'value' };
      service.setValue('test-key', data);
      expect(localStorage.getItem('test-key')).toBe(JSON.stringify(data));
    });
  });

  describe('clearValue', () => {
    it('should remove item from localStorage', () => {
      localStorage.setItem('test-key', 'value');
      service.clearValue('test-key');
      expect(localStorage.getItem('test-key')).toBeNull();
    });
  });

  describe('clearAll', () => {
    it('should clear all items from localStorage', () => {
      localStorage.setItem('key1', 'val1');
      localStorage.setItem('key2', 'val2');
      service.clearAll();
      expect(localStorage.length).toBe(0);
    });
  });
});
